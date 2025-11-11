#!/usr/bin/env python3
"""
Backup Checker
Queries DigitalOcean Spaces to verify backup status and recency.
"""

import os
import boto3
from datetime import datetime, timezone
from typing import Dict, Optional
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class BackupChecker:
    """Client for checking backup status in DigitalOcean Spaces."""
    
    def __init__(self, endpoint: str, access_key: str, secret_key: str, bucket: str):
        """
        Initialize Backup Checker.
        
        Args:
            endpoint: DigitalOcean Spaces endpoint (e.g., nyc3.digitaloceanspaces.com)
            access_key: Spaces access key
            secret_key: Spaces secret key
            bucket: Bucket name where backups are stored
        """
        self.bucket = bucket
        self.s3_client = boto3.client(
            's3',
            endpoint_url=f'https://{endpoint}',
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key,
            region_name='us-east-1'  # Required but not used by Spaces
        )
        logger.info(f"Initialized BackupChecker for bucket: {bucket}")
    
    def list_backups(self, prefix: str = 'backups/') -> list:
        """
        List all backup files in the bucket.
        
        Args:
            prefix: Prefix/path to backup files
            
        Returns:
            List of backup objects sorted by last modified (newest first)
        """
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket,
                Prefix=prefix
            )
            
            if 'Contents' not in response:
                logger.warning(f"No backups found in {self.bucket}/{prefix}")
                return []
            
            # Sort by LastModified descending (newest first)
            backups = sorted(
                response['Contents'],
                key=lambda x: x['LastModified'],
                reverse=True
            )
            
            logger.info(f"Found {len(backups)} backup files")
            return backups
            
        except Exception as e:
            logger.error(f"Failed to list backups: {e}")
            raise
    
    def get_latest_backup(self, prefix: str = 'backups/') -> Optional[Dict]:
        """
        Get the most recent backup file.
        
        Args:
            prefix: Prefix/path to backup files
            
        Returns:
            Dictionary with backup metadata or None if no backups found
        """
        backups = self.list_backups(prefix)
        
        if not backups:
            return None
        
        latest = backups[0]  # Already sorted newest first
        
        return {
            'key': latest['Key'],
            'size': latest['Size'],
            'last_modified': latest['LastModified'],
            'etag': latest['ETag'].strip('"')
        }
    
    def calculate_backup_age(self, backup: Dict) -> float:
        """
        Calculate age of backup in hours.
        
        Args:
            backup: Backup metadata dictionary
            
        Returns:
            Age in hours
        """
        now = datetime.now(timezone.utc)
        last_modified = backup['last_modified']
        
        # Ensure last_modified is timezone-aware
        if last_modified.tzinfo is None:
            last_modified = last_modified.replace(tzinfo=timezone.utc)
        
        age = now - last_modified
        hours = age.total_seconds() / 3600
        
        return hours
    
    def check_backup_status(
        self,
        prefix: str = 'backups/',
        max_age_hours: int = 25
    ) -> Dict[str, any]:
        """
        Check backup status and determine health.
        
        Args:
            prefix: Prefix/path to backup files
            max_age_hours: Maximum acceptable backup age in hours
            
        Returns:
            Dictionary with backup status information:
            {
                'status': 'success' | 'warning' | 'failed' | 'unknown',
                'last_backup_time': ISO timestamp or None,
                'age_hours': float or None,
                'size_bytes': int or None
            }
        """
        try:
            latest_backup = self.get_latest_backup(prefix)
            
            if not latest_backup:
                logger.warning("No backups found")
                return {
                    'status': 'failed',
                    'last_backup_time': None,
                    'age_hours': None,
                    'size_bytes': None,
                    'message': 'No backups found'
                }
            
            age_hours = self.calculate_backup_age(latest_backup)
            
            # Determine status based on age
            if age_hours < max_age_hours:
                status = 'success'
                message = f'Backup is recent ({age_hours:.1f}h old)'
            elif age_hours < max_age_hours * 2:
                status = 'warning'
                message = f'Backup is aging ({age_hours:.1f}h old)'
            else:
                status = 'failed'
                message = f'Backup is too old ({age_hours:.1f}h old)'
            
            logger.info(f"Backup status: {status} - {message}")
            
            return {
                'status': status,
                'last_backup_time': latest_backup['last_modified'].isoformat(),
                'age_hours': round(age_hours, 2),
                'size_bytes': latest_backup['size'],
                'message': message
            }
            
        except Exception as e:
            logger.error(f"Failed to check backup status: {e}")
            return {
                'status': 'unknown',
                'last_backup_time': None,
                'age_hours': None,
                'size_bytes': None,
                'message': f'Error checking backups: {str(e)}'
            }
    
    def verify_backup_integrity(self, backup_key: str) -> bool:
        """
        Verify backup file exists and is accessible.
        
        Args:
            backup_key: S3 key of backup file
            
        Returns:
            True if backup is accessible, False otherwise
        """
        try:
            self.s3_client.head_object(Bucket=self.bucket, Key=backup_key)
            logger.info(f"Backup verified: {backup_key}")
            return True
        except Exception as e:
            logger.error(f"Failed to verify backup {backup_key}: {e}")
            return False


def main():
    """Test the backup checker."""
    from dotenv import load_dotenv
    load_dotenv()
    
    # Get configuration from environment
    endpoint = os.getenv('SPACES_ENDPOINT')
    access_key = os.getenv('SPACES_ACCESS_KEY')
    secret_key = os.getenv('SPACES_SECRET_KEY')
    bucket = os.getenv('BACKUP_BUCKET')
    prefix = os.getenv('BACKUP_PREFIX', 'backups/')
    max_age = int(os.getenv('BACKUP_MAX_AGE_HOURS', '25'))
    
    if not all([endpoint, access_key, secret_key, bucket]):
        logger.error("Missing required environment variables")
        return
    
    # Initialize checker
    checker = BackupChecker(endpoint, access_key, secret_key, bucket)
    
    # Check backup status
    print("\n=== Testing Backup Checker ===\n")
    
    status = checker.check_backup_status(prefix, max_age)
    
    print(f"Status: {status['status']}")
    print(f"Last Backup: {status['last_backup_time']}")
    print(f"Age: {status['age_hours']} hours" if status['age_hours'] else "Age: N/A")
    print(f"Size: {status['size_bytes']} bytes" if status['size_bytes'] else "Size: N/A")
    print(f"Message: {status['message']}")


if __name__ == '__main__':
    main()
