# Ansible Deployment for Recruitment Platform

This directory contains Ansible playbooks and roles for deploying the recruitment platform.

## Prerequisites

- Ansible 2.9 or higher
- SSH access to target servers
- Python 3.6+ on target servers

## Directory Structure

```
ansible/
├── inventories/          # Server inventories
│   ├── production/       # Production environment
│   └── staging/          # Staging environment
├── roles/                # Ansible roles
│   ├── common/           # Common system setup
│   ├── backend/          # Django backend deployment
│   ├── frontend/         # Next.js frontend deployment
│   ├── nginx/            # Nginx configuration
│   ├── postgresql/       # PostgreSQL setup
│   └── ssl/              # SSL certificate management
├── playbooks/            # Deployment playbooks
│   ├── site.yml          # Full deployment
│   ├── deploy.yml        # Application deployment
│   ├── backup.yml        # Backup procedures
│   └── rollback.yml      # Rollback procedures
└── ansible.cfg           # Ansible configuration
```

## Quick Start

### 1. Configure Inventory

Edit the inventory file for your environment:

```bash
vi inventories/production/hosts.yml
```

### 2. Set Variables

Configure environment-specific variables:

```bash
vi inventories/production/group_vars/all.yml
```

### 3. Create Vault Password File

```bash
echo "your-vault-password" > .vault_pass
chmod 600 .vault_pass
```

### 4. Encrypt Sensitive Variables

```bash
ansible-vault encrypt_string 'your-secret-key' --name 'vault_django_secret_key'
ansible-vault encrypt_string 'your-db-password' --name 'vault_db_password'
```

## Deployment Commands

### Full Deployment (First Time)

```bash
ansible-playbook -i inventories/production/hosts.yml playbooks/site.yml
```

### Application Update

```bash
ansible-playbook -i inventories/production/hosts.yml playbooks/deploy.yml
```

### Create Backup

```bash
ansible-playbook -i inventories/production/hosts.yml playbooks/backup.yml
```

### Rollback Deployment

```bash
ansible-playbook -i inventories/production/hosts.yml playbooks/rollback.yml
```

### Deploy Specific Components

```bash
# Backend only
ansible-playbook -i inventories/production/hosts.yml playbooks/site.yml --tags backend

# Frontend only
ansible-playbook -i inventories/production/hosts.yml playbooks/site.yml --tags frontend

# SSL setup
ansible-playbook -i inventories/production/hosts.yml playbooks/site.yml --tags ssl
```

## Environment-Specific Deployments

### Staging

```bash
ansible-playbook -i inventories/staging/hosts.yml playbooks/deploy.yml
```

### Production

```bash
ansible-playbook -i inventories/production/hosts.yml playbooks/deploy.yml
```

## Configuration Options

### Key Variables

- `app_name`: Application name
- `app_repo`: Git repository URL
- `app_branch`: Git branch to deploy
- `domain_name`: Domain name for the application
- `backend_workers`: Number of Gunicorn workers
- `frontend_instances`: Number of PM2 instances

### SSL Configuration

SSL certificates are automatically obtained using Let's Encrypt. Ensure:

1. Domain points to server IP
2. Ports 80 and 443 are open
3. Valid email in `ssl_email` variable

### Database Configuration

- `db_name`: Database name
- `db_user`: Database user
- `db_password`: Database password (vaulted)
- `db_host`: Database host

## Monitoring

### Check Service Status

```bash
ansible webservers -i inventories/production/hosts.yml -m shell -a "systemctl status recruit-backend"
ansible webservers -i inventories/production/hosts.yml -m shell -a "pm2 status"
```

### View Logs

```bash
# Backend logs
ansible webservers -i inventories/production/hosts.yml -m shell -a "tail -f /var/log/recruit/gunicorn-error.log"

# Frontend logs
ansible webservers -i inventories/production/hosts.yml -m shell -a "pm2 logs recruit-frontend"
```

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure deploy user has sudo access
2. **Port Already in Use**: Check for conflicting services
3. **SSL Certificate Failed**: Verify domain DNS settings

### Debug Mode

Run playbooks with verbose output:

```bash
ansible-playbook -i inventories/production/hosts.yml playbooks/deploy.yml -vvv
```

### Check Connectivity

```bash
ansible all -i inventories/production/hosts.yml -m ping
```

## Security Best Practices

1. Use Ansible Vault for sensitive data
2. Limit SSH access to deployment machines
3. Use SSH keys instead of passwords
4. Keep playbooks in version control
5. Regular security updates

## Backup and Recovery

### Automated Backups

Backups are created automatically during deployments and can be scheduled:

```bash
# Add to crontab
0 2 * * * ansible-playbook -i inventories/production/hosts.yml playbooks/backup.yml
```

### Manual Recovery

```bash
# List available backups
ansible webservers -i inventories/production/hosts.yml -m shell -a "ls -la /var/backups/recruit_platform/"

# Restore from specific backup
ansible-playbook -i inventories/production/hosts.yml playbooks/rollback.yml -e "rollback_version=latest"
```

## Performance Tuning

1. Adjust `backend_workers` based on CPU cores
2. Configure `frontend_instances` for load distribution
3. Enable caching in Nginx configuration
4. Use Redis for session storage

## License

[Your License]