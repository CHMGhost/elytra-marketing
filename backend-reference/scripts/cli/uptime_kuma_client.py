#!/usr/bin/env python3
"""
Uptime Kuma API Client
Fetches monitor status and calculates uptime metrics.
"""

import os
import requests
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class UptimeKumaClient:
    """Client for interacting with Uptime Kuma API."""
    
    def __init__(self, base_url: str, api_key: str):
        """
        Initialize Uptime Kuma client.
        
        Args:
            base_url: Uptime Kuma instance URL (e.g., https://uptime.yourdomain.com)
            api_key: API key for authentication
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })
    
    def get_monitors(self) -> List[Dict]:
        """
        Fetch all monitors.
        
        Returns:
            List of monitor dictionaries with status and metadata
        """
        try:
            response = self.session.get(f'{self.base_url}/api/monitor')
            response.raise_for_status()
            data = response.json()
            
            # Uptime Kuma API response structure varies by version
            # Adjust this based on your actual API response
            monitors = data.get('monitors', []) if isinstance(data, dict) else data
            
            logger.info(f"Fetched {len(monitors)} monitors")
            return monitors
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch monitors: {e}")
            raise
    
    def get_monitor_heartbeats(self, monitor_id: int, hours: int = 24) -> List[Dict]:
        """
        Fetch heartbeat history for a specific monitor.
        
        Args:
            monitor_id: Monitor ID
            hours: Number of hours of history to fetch
            
        Returns:
            List of heartbeat dictionaries
        """
        try:
            response = self.session.get(
                f'{self.base_url}/api/monitor/{monitor_id}/heartbeat',
                params={'hours': hours}
            )
            response.raise_for_status()
            heartbeats = response.json()
            
            logger.debug(f"Fetched {len(heartbeats)} heartbeats for monitor {monitor_id}")
            return heartbeats
            
        except requests.RequestException as e:
            logger.error(f"Failed to fetch heartbeats for monitor {monitor_id}: {e}")
            return []
    
    def calculate_uptime(self, monitor_id: int, hours: int = 24) -> float:
        """
        Calculate uptime percentage for a monitor over specified time period.
        
        Args:
            monitor_id: Monitor ID
            hours: Time period in hours
            
        Returns:
            Uptime percentage (0.0 - 100.0)
        """
        heartbeats = self.get_monitor_heartbeats(monitor_id, hours)
        
        if not heartbeats:
            logger.warning(f"No heartbeats found for monitor {monitor_id}")
            return 0.0
        
        # Count successful heartbeats (status = 1 means UP)
        successful = sum(1 for h in heartbeats if h.get('status') == 1)
        total = len(heartbeats)
        
        uptime = (successful / total) * 100 if total > 0 else 0.0
        logger.debug(f"Monitor {monitor_id} uptime ({hours}h): {uptime:.2f}%")
        
        return round(uptime, 2)
    
    def get_platform_status(self, monitor_ids: Optional[List[int]] = None) -> str:
        """
        Determine overall platform status based on monitor states.
        
        Args:
            monitor_ids: Optional list of specific monitor IDs to check.
                        If None, checks all monitors.
        
        Returns:
            Platform status: "operational" | "degraded" | "outage" | "unknown"
        """
        try:
            monitors = self.get_monitors()
            
            # Filter to specific monitors if provided
            if monitor_ids:
                monitors = [m for m in monitors if m.get('id') in monitor_ids]
            
            if not monitors:
                logger.warning("No monitors found")
                return "unknown"
            
            # Check monitor statuses
            # Status codes: 0 = DOWN, 1 = UP, 2 = PENDING/MAINTENANCE
            statuses = [m.get('status', 0) for m in monitors]
            
            # Any monitor DOWN → outage
            if 0 in statuses:
                logger.warning("Platform outage detected (monitor(s) down)")
                return "outage"
            
            # Any monitor PENDING/MAINTENANCE → degraded
            if 2 in statuses:
                logger.info("Platform degraded (monitor(s) in maintenance/pending)")
                return "degraded"
            
            # All monitors UP → operational
            if all(s == 1 for s in statuses):
                logger.info("Platform operational (all monitors up)")
                return "operational"
            
            # Unknown state
            logger.warning(f"Unknown platform state: {statuses}")
            return "unknown"
            
        except Exception as e:
            logger.error(f"Failed to determine platform status: {e}")
            return "unknown"
    
    def get_aggregated_uptime(self, monitor_ids: Optional[List[int]] = None) -> Dict[str, float]:
        """
        Calculate aggregated uptime across multiple time periods.
        
        Args:
            monitor_ids: Optional list of monitor IDs to include
        
        Returns:
            Dictionary with uptime percentages for 24h, 7d, 30d
        """
        try:
            monitors = self.get_monitors()
            
            # Filter to specific monitors if provided
            if monitor_ids:
                monitors = [m for m in monitors if m.get('id') in monitor_ids]
            
            if not monitors:
                logger.warning("No monitors to calculate uptime for")
                return {
                    "last_24h": 0.0,
                    "last_7d": 0.0,
                    "last_30d": 0.0
                }
            
            # Calculate uptime for each period (average across all monitors)
            periods = {
                "last_24h": 24,
                "last_7d": 24 * 7,
                "last_30d": 24 * 30
            }
            
            uptime_data = {}
            
            for period_name, hours in periods.items():
                uptimes = []
                for monitor in monitors:
                    monitor_id = monitor.get('id')
                    if monitor_id:
                        uptime = self.calculate_uptime(monitor_id, hours)
                        uptimes.append(uptime)
                
                # Average uptime across all monitors
                avg_uptime = sum(uptimes) / len(uptimes) if uptimes else 0.0
                uptime_data[period_name] = round(avg_uptime, 2)
                
                logger.info(f"{period_name}: {avg_uptime:.2f}%")
            
            return uptime_data
            
        except Exception as e:
            logger.error(f"Failed to calculate aggregated uptime: {e}")
            return {
                "last_24h": 0.0,
                "last_7d": 0.0,
                "last_30d": 0.0
            }


def main():
    """Test the Uptime Kuma client."""
    from dotenv import load_dotenv
    load_dotenv()
    
    # Get configuration from environment
    base_url = os.getenv('UPTIME_KUMA_URL')
    api_key = os.getenv('UPTIME_KUMA_API_KEY')
    
    if not base_url or not api_key:
        logger.error("Missing UPTIME_KUMA_URL or UPTIME_KUMA_API_KEY environment variables")
        return
    
    # Initialize client
    client = UptimeKumaClient(base_url, api_key)
    
    # Test operations
    print("\n=== Testing Uptime Kuma Client ===\n")
    
    # Get platform status
    status = client.get_platform_status()
    print(f"Platform Status: {status}")
    
    # Get aggregated uptime
    uptime = client.get_aggregated_uptime()
    print(f"\nUptime Metrics:")
    print(f"  Last 24h: {uptime['last_24h']}%")
    print(f"  Last 7d:  {uptime['last_7d']}%")
    print(f"  Last 30d: {uptime['last_30d']}%")


if __name__ == '__main__':
    main()
