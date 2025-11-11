#!/usr/bin/env python3
"""
Platform Status Generator
Main script that orchestrates data collection and generates status.json.
"""

import os
import json
from datetime import datetime, timezone
from typing import Dict
import logging
from pathlib import Path

# Import our custom modules
from uptime_kuma_client import UptimeKumaClient
from backup_checker import BackupChecker

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def load_env_config() -> Dict[str, str]:
    """
    Load configuration from environment variables.
    
    Returns:
        Dictionary with configuration values
    """
    from dotenv import load_dotenv
    
    # Load .env file if it exists
    env_path = Path(__file__).parent.parent.parent / 'config' / '.env'
    if env_path.exists():
        load_dotenv(env_path)
    else:
        load_dotenv()  # Load from current directory or parent
    
    config = {
        # Uptime Kuma
        'uptime_kuma_url': os.getenv('UPTIME_KUMA_URL'),
        'uptime_kuma_api_key': os.getenv('UPTIME_KUMA_API_KEY'),
        'monitor_ids': os.getenv('MONITOR_IDS', ''),  # Comma-separated list
        
        # DigitalOcean Spaces (Backups)
        'spaces_endpoint': os.getenv('SPACES_ENDPOINT'),
        'spaces_access_key': os.getenv('SPACES_ACCESS_KEY'),
        'spaces_secret_key': os.getenv('SPACES_SECRET_KEY'),
        'backup_bucket': os.getenv('BACKUP_BUCKET'),
        'backup_prefix': os.getenv('BACKUP_PREFIX', 'backups/'),
        'backup_max_age_hours': int(os.getenv('BACKUP_MAX_AGE_HOURS', '25')),
        
        # Output
        'output_file': os.getenv('OUTPUT_FILE', '/tmp/status.json'),
    }
    
    return config


def parse_monitor_ids(monitor_ids_str: str) -> list:
    """
    Parse comma-separated monitor IDs into list of integers.
    
    Args:
        monitor_ids_str: Comma-separated monitor IDs (e.g., "1,2,3")
        
    Returns:
        List of monitor IDs as integers, or empty list
    """
    if not monitor_ids_str:
        return []
    
    try:
        return [int(id.strip()) for id in monitor_ids_str.split(',') if id.strip()]
    except ValueError as e:
        logger.warning(f"Failed to parse monitor IDs '{monitor_ids_str}': {e}")
        return []


def generate_status_json(config: Dict[str, str]) -> Dict:
    """
    Generate the complete status.json data structure.
    
    Args:
        config: Configuration dictionary
        
    Returns:
        Dictionary matching the frontend schema
    """
    status_data = {
        'updated_at': datetime.now(timezone.utc).isoformat(),
        'platform_status': 'unknown',
        'uptime': {
            'last_24h': 0.0,
            'last_7d': 0.0,
            'last_30d': 0.0
        },
        'backups': {
            'last_backup_status': 'unknown',
            'last_backup_time': None
        }
    }
    
    # Parse monitor IDs
    monitor_ids = parse_monitor_ids(config['monitor_ids'])
    if monitor_ids:
        logger.info(f"Monitoring specific monitor IDs: {monitor_ids}")
    else:
        logger.info("Monitoring all monitors")
    
    # === Fetch Uptime Kuma Data ===
    try:
        if not config['uptime_kuma_url'] or not config['uptime_kuma_api_key']:
            logger.warning("Uptime Kuma credentials not configured")
        else:
            logger.info("Fetching Uptime Kuma data...")
            
            kuma_client = UptimeKumaClient(
                config['uptime_kuma_url'],
                config['uptime_kuma_api_key']
            )
            
            # Get platform status
            platform_status = kuma_client.get_platform_status(
                monitor_ids if monitor_ids else None
            )
            status_data['platform_status'] = platform_status
            
            # Get uptime metrics
            uptime_data = kuma_client.get_aggregated_uptime(
                monitor_ids if monitor_ids else None
            )
            status_data['uptime'] = uptime_data
            
            logger.info(f"✅ Platform status: {platform_status}")
            
    except Exception as e:
        logger.error(f"❌ Failed to fetch Uptime Kuma data: {e}")
        # Keep default values (unknown, 0.0)
    
    # === Check Backup Status ===
    try:
        if not all([
            config['spaces_endpoint'],
            config['spaces_access_key'],
            config['spaces_secret_key'],
            config['backup_bucket']
        ]):
            logger.warning("Backup checker credentials not configured")
        else:
            logger.info("Checking backup status...")
            
            backup_checker = BackupChecker(
                config['spaces_endpoint'],
                config['spaces_access_key'],
                config['spaces_secret_key'],
                config['backup_bucket']
            )
            
            backup_status = backup_checker.check_backup_status(
                prefix=config['backup_prefix'],
                max_age_hours=config['backup_max_age_hours']
            )
            
            status_data['backups']['last_backup_status'] = backup_status['status']
            status_data['backups']['last_backup_time'] = backup_status['last_backup_time']
            
            logger.info(f"✅ Backup status: {backup_status['status']}")
            
    except Exception as e:
        logger.error(f"❌ Failed to check backup status: {e}")
        # Keep default values (unknown, None)
    
    return status_data


def save_status_json(data: Dict, output_file: str) -> None:
    """
    Save status data to JSON file.
    
    Args:
        data: Status data dictionary
        output_file: Output file path
    """
    try:
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        
        logger.info(f"✅ Saved status.json to {output_file}")
        
    except Exception as e:
        logger.error(f"❌ Failed to save status.json: {e}")
        raise


def main():
    """Main execution flow."""
    logger.info("=== Platform Status Generator ===")
    
    try:
        # Load configuration
        config = load_env_config()
        
        # Generate status data
        status_data = generate_status_json(config)
        
        # Save to file
        save_status_json(status_data, config['output_file'])
        
        # Print summary
        print("\n" + "="*50)
        print("Status Generation Complete")
        print("="*50)
        print(f"Platform Status: {status_data['platform_status']}")
        print(f"Uptime (24h): {status_data['uptime']['last_24h']}%")
        print(f"Uptime (7d): {status_data['uptime']['last_7d']}%")
        print(f"Uptime (30d): {status_data['uptime']['last_30d']}%")
        print(f"Backup Status: {status_data['backups']['last_backup_status']}")
        print(f"Last Backup: {status_data['backups']['last_backup_time']}")
        print(f"\nOutput: {config['output_file']}")
        print("="*50 + "\n")
        
        return 0
        
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        return 1


if __name__ == '__main__':
    exit(main())
