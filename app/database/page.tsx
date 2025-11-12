'use client';

import { useState } from 'react';
import { PageShell } from '@/components/page-shell';
import { CreateButton } from '../../components/create-button';
import { StatusBadge } from '../../components/status-badge';
import { databases } from '../../lib/data';
import { ActionMenu } from '../../components/action-menu';
import { ShadcnDataTable } from '../../components/ui/shadcn-data-table';
import {
  filterDataForUser,
  shouldShowEmptyState,
  getEmptyStateMessage,
} from '../../lib/demo-data-filter';
import { EmptyState } from '../../components/ui/empty-state';
import { Card, CardContent } from '../../components/ui/card';
import { Database, Pause, Play, RotateCcw, FolderDown, ArrowUpCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function DatabaseListPage() {
  // State for DB type filter
  const [selectedDbType, setSelectedDbType] = useState('all');
  
  // State for modals
  const [pauseResumeModalOpen, setPauseResumeModalOpen] = useState(false);
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedDatabase, setSelectedDatabase] = useState<any>(null);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState('');
  const [selectedUpgradeVersion, setSelectedUpgradeVersion] = useState('');
  
  // Toast hook
  const { toast } = useToast();

  // Filter data based on user type for demo
  const userFilteredDatabases = filterDataForUser(databases);
  const showEmptyState = shouldShowEmptyState() && userFilteredDatabases.length === 0;

  // Get unique DB engines for filter dropdown
  const dbTypeOptions = [
    { value: 'all', label: 'All Types' },
    ...Array.from(new Set(databases.map(db => db.dbEngine)))
      .sort()
      .map(engine => ({
        value: engine,
        label: engine,
      })),
  ];

  // Filter databases by selected type
  const filteredDatabases = selectedDbType === 'all'
    ? userFilteredDatabases
    : userFilteredDatabases.filter(db => db.dbEngine === selectedDbType);

  // Handler functions for database actions
  const handlePauseResume = (database: any) => {
    setSelectedDatabase(database);
    setPauseResumeModalOpen(true);
  };

  const handleRestart = (database: any) => {
    setSelectedDatabase(database);
    setRestartModalOpen(true);
  };
  
  // Confirm pause/resume action
  const confirmPauseResume = () => {
    if (!selectedDatabase) return;
    
    const action = selectedDatabase.status === 'stopped' ? 'resumed' : 'paused';
    const actionCapitalized = selectedDatabase.status === 'stopped' ? 'Resume' : 'Pause';
    
    // Mock API call
    console.log(`${actionCapitalized} database:`, selectedDatabase.name);
    
    // Show success toast
    toast({
      title: `Database ${actionCapitalized}d`,
      description: `${selectedDatabase.name} has been ${action} successfully.`,
    });
    
    // Close modal
    setPauseResumeModalOpen(false);
    setSelectedDatabase(null);
  };
  
  // Confirm restart action
  const confirmRestart = () => {
    if (!selectedDatabase) return;
    
    // Mock API call
    console.log('Restart database:', selectedDatabase.name);
    
    // Show success toast
    toast({
      title: 'Database Restarted',
      description: `${selectedDatabase.name} has been restarted successfully.`,
    });
    
    // Close modal
    setRestartModalOpen(false);
    setSelectedDatabase(null);
  };

  const handleCreateFromBackup = (database: any) => {
    console.log('Create DB from backup:', database.name);
    // Mock navigation to create from backup flow
  };

  const handleRestoreFromBackup = (database: any) => {
    console.log('Restore DB from backup:', database.name);
    // Mock navigation to restore flow
  };

  const handleUpgrade = (database: any) => {
    setSelectedDatabase(database);
    setSelectedUpgradeVersion('');
    setUpgradeModalOpen(true);
  };
  
  // Confirm upgrade action
  const confirmUpgrade = () => {
    if (!selectedDatabase || !selectedUpgradeVersion) return;
    
    // Mock API call
    console.log('Upgrade database:', selectedDatabase.name, 'to version:', selectedUpgradeVersion);
    
    // Show success toast
    toast({
      title: 'Database Upgrade Initiated',
      description: `${selectedDatabase.name} is being upgraded to version ${selectedUpgradeVersion}.`,
    });
    
    // Close modal and reset
    setUpgradeModalOpen(false);
    setSelectedDatabase(null);
    setSelectedUpgradeVersion('');
  };
  
  // Get available versions based on database engine
  const getAvailableVersions = (engine: string) => {
    const versions: { [key: string]: string[] } = {
      'MySQL': ['8.0.35', '8.0.33', '8.0.32', '5.7.42', '5.7.40'],
      'PostgreSQL': ['15.4', '15.3', '14.9', '14.8', '13.12'],
      'MongoDB': ['7.0.5', '7.0.4', '6.0.13', '6.0.12', '5.0.24'],
    };
    return versions[engine] || [];
  };

  const handleDelete = (database: any) => {
    setSelectedDatabase(database);
    setDeleteConfirmationInput('');
    setDeleteModalOpen(true);
  };
  
  // Confirm delete action
  const confirmDelete = () => {
    if (!selectedDatabase || deleteConfirmationInput !== selectedDatabase.name) return;
    
    // Mock API call
    console.log('Delete database:', selectedDatabase.name);
    
    // Show success toast
    toast({
      title: 'Database Deleted',
      description: `${selectedDatabase.name} has been deleted successfully.`,
      variant: 'destructive',
    });
    
    // Close modal and reset
    setDeleteModalOpen(false);
    setSelectedDatabase(null);
    setDeleteConfirmationInput('');
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: any) => (
        <a
          href={`/database/${row.id}`}
          className='text-primary font-medium hover:underline leading-5'
        >
          {row.name}
        </a>
      ),
    },
    {
      key: 'dbEngine',
      label: 'DB Engine',
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <span className='text-foreground leading-5'>{value}</span>
      ),
    },
    {
      key: 'engineVersion',
      label: 'Engine Version',
      sortable: true,
      render: (value: string) => (
        <span className='text-muted-foreground leading-5'>{value}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} />,
    },
    {
      key: 'createdOn',
      label: 'Created On',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return (
          <div className='text-muted-foreground leading-5'>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right' as const,
      render: (value: any, row: any) => {
        // Define custom actions based on database status
        const customActions = [
          {
            label: row.status === 'stopped' ? 'Resume' : 'Pause',
            onClick: () => handlePauseResume(row),
            icon: row.status === 'stopped' ? (
              <Play className='mr-2 h-4 w-4' />
            ) : (
              <Pause className='mr-2 h-4 w-4' />
            ),
          },
          {
            label: 'Restart',
            onClick: () => handleRestart(row),
            icon: <RotateCcw className='mr-2 h-4 w-4' />,
          },
          {
            label: 'Create DB from Backup',
            onClick: () => handleCreateFromBackup(row),
            icon: <FolderDown className='mr-2 h-4 w-4' />,
          },
          {
            label: 'Restore DB from Backup',
            onClick: () => handleRestoreFromBackup(row),
            icon: <FolderDown className='mr-2 h-4 w-4' />,
          },
          {
            label: 'Upgrade',
            onClick: () => handleUpgrade(row),
            icon: <ArrowUpCircle className='mr-2 h-4 w-4' />,
          },
        ];

        return (
          <div className='flex justify-end'>
            <ActionMenu
              viewHref={`/database/${row.id}`}
              onCustomDelete={() => handleDelete(row)}
              resourceName={row.name}
              resourceType='Database'
              customActions={customActions}
            />
          </div>
        );
      },
    },
  ];

  const handleRefresh = () => {
    console.log('🔄 Refreshing database data at:', new Date().toLocaleTimeString());
  };

  // Database illustration icon
  const databaseIcon = (
    <Database className='w-72 h-72 text-muted-foreground/20' strokeWidth={0.5} />
  );

  return (
    <PageShell
      title='Database'
      description='Create and manage your database instances with support for MySQL, PostgreSQL, and MongoDB.'
      headerActions={
        <CreateButton href='/database/create' label='Create Database' />
      }
    >
      {showEmptyState ? (
        <Card className='mt-8'>
          <CardContent>
            <EmptyState
              {...getEmptyStateMessage('database')}
              onAction={() => (window.location.href = '/database/create')}
              icon={databaseIcon}
            />
          </CardContent>
        </Card>
      ) : (
        <ShadcnDataTable
          columns={columns}
          data={filteredDatabases}
          searchableColumns={['name', 'dbEngine']}
          pageSize={10}
          enableSearch={true}
          enableColumnVisibility={false}
          enablePagination={true}
          onRefresh={handleRefresh}
          enableAutoRefresh={true}
          enableVpcFilter={true}
          vpcOptions={dbTypeOptions}
          onVpcChange={setSelectedDbType}
        />
      )}

      {/* Pause/Resume Confirmation Modal */}
      <Dialog open={pauseResumeModalOpen} onOpenChange={setPauseResumeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDatabase?.status === 'stopped' ? 'Resume' : 'Pause'} Database
            </DialogTitle>
            <DialogDescription>
              {selectedDatabase?.status === 'stopped' ? (
                <>
                  Resume <strong>{selectedDatabase?.name}</strong>? It will be available for connections shortly.
                </>
              ) : (
                <>
                  Are you sure you want to pause <strong>{selectedDatabase?.name}</strong>? Your applications won't be able to connect during this time.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setPauseResumeModalOpen(false);
                setSelectedDatabase(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmPauseResume}>
              {selectedDatabase?.status === 'stopped' ? 'Resume' : 'Pause'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restart Confirmation Modal */}
      <Dialog open={restartModalOpen} onOpenChange={setRestartModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restart Database</DialogTitle>
            <DialogDescription>
              Restart <strong>{selectedDatabase?.name}</strong>? This will cause a brief interruption in service.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setRestartModalOpen(false);
                setSelectedDatabase(null);
              }}
            >
              Cancel
            </Button>
            <Button onClick={confirmRestart}>
              Restart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Database</DialogTitle>
            <DialogDescription className='space-y-3'>
              <div>
                Are you sure you want to delete <strong>{selectedDatabase?.name}</strong>?
              </div>
              <div className='p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm'>
                <strong>Warning:</strong> This action cannot be undone. All data, backups, and configurations associated with this database will be permanently deleted.
              </div>
            </DialogDescription>
          </DialogHeader>
          
          <div className='space-y-2 py-4'>
            <Label htmlFor='delete-confirmation'>
              Please type <strong>{selectedDatabase?.name}</strong> to confirm
            </Label>
            <Input
              id='delete-confirmation'
              value={deleteConfirmationInput}
              onChange={(e) => setDeleteConfirmationInput(e.target.value)}
              placeholder={`Enter database name: ${selectedDatabase?.name}`}
              className='font-mono'
            />
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setDeleteModalOpen(false);
                setSelectedDatabase(null);
                setDeleteConfirmationInput('');
              }}
            >
              Cancel
            </Button>
            <Button 
              variant='destructive' 
              onClick={confirmDelete}
              disabled={deleteConfirmationInput !== selectedDatabase?.name}
            >
              Delete Database
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upgrade Confirmation Modal */}
      <Dialog open={upgradeModalOpen} onOpenChange={setUpgradeModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade Database Version</DialogTitle>
            <DialogDescription>
              Upgrade <strong>{selectedDatabase?.name}</strong> to a newer version. The database will be restarted during the upgrade process.
            </DialogDescription>
          </DialogHeader>
          
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label>Current Version</Label>
              <div className='p-3 bg-muted rounded-md border'>
                <span className='font-mono font-medium'>{selectedDatabase?.engineVersion}</span>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='upgrade-version'>Select New Version</Label>
              <Select
                value={selectedUpgradeVersion}
                onValueChange={setSelectedUpgradeVersion}
              >
                <SelectTrigger id='upgrade-version'>
                  <SelectValue placeholder='Select version' />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableVersions(selectedDatabase?.dbEngine).map((version) => (
                    <SelectItem 
                      key={version} 
                      value={version}
                      disabled={version === selectedDatabase?.engineVersion}
                    >
                      {version}
                      {version === selectedDatabase?.engineVersion && ' (Current)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className='p-3 bg-blue-50 border border-blue-200 rounded-md text-sm'>
              <strong>Note:</strong> We recommend creating a backup before upgrading. The upgrade process will restart your database.
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setUpgradeModalOpen(false);
                setSelectedDatabase(null);
                setSelectedUpgradeVersion('');
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmUpgrade}
              disabled={!selectedUpgradeVersion || selectedUpgradeVersion === selectedDatabase?.engineVersion}
            >
              Upgrade Database
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

