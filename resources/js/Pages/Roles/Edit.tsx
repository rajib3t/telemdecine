"use client"
import {useState, useEffect, FormEventHandler} from 'react';
import axios from 'axios';
import { RoleInterface } from "@/Interfaces/RoleInterface";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head , usePage, useForm, router, Deferred} from "@inertiajs/react";
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
import {PageProps}  from '@/types';
import {PermissionGroupsListInterface, PermissionGroupInterface, PermissionInterface} from '@/Interfaces/PermissionInterface';
import { Search, RotateCcw } from 'lucide-react';
import RenderPaginationItem from '@/Components/RenderPaginationItem';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from '@/Components/ui/card';
// Shadcn Component Table
import {
    Table,
    TableBody,
    TableRow,
    TableCell,
    TableHeader,
    TableHead,
} from '@/Components/ui/table';
// Shadcn Pagination component
import {
    Pagination,
    PaginationContent
} from "@/Components/ui/pagination";
import { Input } from '@/Components/ui/input';
import { Label } from  '@/Components/ui/label';
import {Textarea } from '@/Components/ui/textarea';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
// For Toast import shadcn toast
import { useToast } from "@/hooks/use-toast"

interface EditProps {
    role: {
        data : RoleInterface
    };
    permissionGroups: PermissionGroupsListInterface;
    filters: any;
}

interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

/**
 * A component for editing role details and managing role permissions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.role - Role data object containing role details
 * @param {Object} props.role.data - Nested role data with id, name, and description
 * @param {Object[]} props.permissionGroups - Array of permission groups available
 * @param {Object} props.filters - Search filters object
 * @param {string} props.filters.name - Name filter for searching permissions
 *
 * @features
 * - Displays and updates role name and description
 * - Shows flash messages for success/error notifications
 * - Handles form submission for role updates
 * - Includes search functionality for permissions
 * - Prevents editing of 'Admin' role name
 * - Auto-dismisses flash messages after 5 seconds
 *
 *
 *
 * @returns {JSX.Element} The rendered edit role form with permission management interface
 */
export default function EditRole({role, permissionGroups, filters}: EditProps) {
    const { props } = usePage<ExtendedPageProps>();
    const { flash } = props;
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    const { toast } = useToast();
    useEffect(() => {
        if (flash?.success || flash?.error) {
            const type = flash.success ? "success" : "error";
            const message = flash.success || flash.error || "";
            setFlashMessage({ type, message });

            const timer = setTimeout(() => setFlashMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    /**
     * Form state and handlers using the useForm hook
     * @property {object} data - Current form data containing name and description
     * @property {Function} setData - Function to update form data
     * @property {Function} patch - Function to submit form data via PATCH request
     * @property {object} errors - Form validation errors
     * @property {boolean} processing - Indicates if form submission is in progress
     */
    const { data, setData, patch, errors, processing } = useForm({
        name: role.data.name,
        description: role.data.description || undefined
    });

    /**
     * Handles the form submission for updating a role.
     * @param {FormEvent} e - The form submission event
     * @description Prevents the default form submission behavior and sends a PATCH request
     * to update the role with the specified ID using the route helper function.
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('role.update', role.data.id));
    };

    /**
     * State hook for managing search parameters
     * @type {[{name: string}, function]} - Tuple containing search params object and setter function
     * @property {string} name - The name filter parameter, initialized from filters prop or empty string
     */
    const [searchParams, setSearchParams] = useState({
        name: filters?.name || '',

    });
    // Search handle
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            route('role.edit', role.data.id),
            searchParams,
            { preserveState: true }
        );
    };
    // Reset search
    const handleReset = () => {
        setSearchParams({
            name: ''

        });
        // Redirect to the base users page without any filters
        router.get(
            route('role.edit', role.data.id),
            {},
            { preserveState: true }
        );
    };
    // Input change handle
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSearchParams(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const [loadingStates, setLoadingStates] = useState<Record<number, boolean>>({});
    const [permissionStates, setPermissionStates] = useState<Record<number, boolean>>({});
    // Initialize permission states from role data
    useEffect(() => {
        const initialStates = role.data.permissions?.reduce((acc, perm) => ({
            ...acc,
            [perm.id]: true
        }), {}) || {};
        setPermissionStates(initialStates);
    }, [role.data.permissions]);
    const handlePermissionToggle = async (permId: number, checked: boolean) => {
        setLoadingStates(prev => ({ ...prev, [permId]: true }));



        try {
          const response = await axios.patch(route('role.add.permission', role.data.id), {
            permission: permId.toString(),
            checked:checked,
            _method: 'PATCH'
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'X-Requested-With': 'XMLHttpRequest'
            }
          });
          console.log(response);

          if (response.status === 200) {
            // Update local state immediately after successful request
            setPermissionStates(prev => ({
                ...prev,
                [permId]: checked
            }));
            toast({
                title:'Success',
                description: response.data.message,
            });
          }
        } catch (error) {
            // Revert the toggle state on error
            setPermissionStates(prev => ({
                ...prev,
                [permId]: !checked
            }));
          console.error('Error updating permission:', error);
          toast({
            title: "Error",
            description: "Failed to update permission. Please try again.",
            variant: "destructive",
          });
        } finally {
          setLoadingStates(prev => ({ ...prev, [permId]: false }));
        }
      };


      const breadcrumbs = [
        { name: "Dashboard", href: route('dashboard') },
        { name: "Roles", href: route('role.index') },
        { name: "Edit", href: null }
    ];
    return (
        <AuthenticatedLayout>
            <Head title={`Edit Role: ${role.data.name}`} />

            <div className="space-y-6">

            <BreadcrumbComponent breadcrumbs={breadcrumbs} />
                <Card>
                    {flashMessage && (
                        <div className="mb-4">
                            <FlashMessage
                                type={flashMessage.type}
                                message={flashMessage.message}
                            />
                        </div>
                    )}
                    <CardHeader>
                        <CardTitle>Edit Role: {role.data.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit}>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="Role name"
                                        disabled={role.data.name === 'Admin'}
                                    />
                                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Role description"
                                    />
                                    {errors.description && <span className="text-red-500">{errors.description}</span>}
                                </div>
                                <div className="flex justify-start">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 disabled:opacity-50"
                                    >
                                        {processing ? 'Updating...' : 'Update'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {role.data.name !== 'Admin' ?  (
                      <Card>
                      <CardHeader>
                          <CardTitle className='font-bold text-xl'>Add Permission to the role</CardTitle>
                      </CardHeader>
                      <CardContent>

                          <form onSubmit={handleSearch} className="space-y-4 mb-6">
                              <div className="flex flex-col sm:flex-row gap-4">
                                  <div className="flex-1">
                                      <Input
                                          type="text"
                                          name="name"
                                          placeholder="Search by name..."
                                          value={searchParams.name}
                                          onChange={handleInputChange}
                                      />
                                  </div>

                                  <div className="flex gap-2">
                                      <Button type="submit" className="w-full sm:w-auto">
                                          <Search className="h-4 w-4 mr-2" />
                                          Search
                                      </Button>
                                      <Button
                                          type="button"
                                          variant="outline"
                                          onClick={handleReset}
                                          className="w-full sm:w-auto "
                                      >
                                          <RotateCcw className="h-4 w-4 mr-2" />
                                          Reset
                                      </Button>
                                  </div>
                              </div>
                          </form>
                          <Table>
                              <TableHeader>
                                  <TableRow>
                                      <TableHead className="w-1/4 font-bold">Name</TableHead>
                                      <TableHead className="w-1/4 font-bold">Action</TableHead>
                                  </TableRow>
                              </TableHeader>
                              <TableBody>
                                  {permissionGroups?.data?.length ? (
                                      permissionGroups.data.map((permissionsGroup: PermissionGroupInterface) => (
                                          <TableRow key={permissionsGroup.id}>
                                              <TableCell>{permissionsGroup.name}</TableCell>
                                              <TableCell>
                                                <div className="flex gap-2">
                                                    {permissionsGroup.permissions.map((perm: PermissionInterface) => {
                                                        const name = perm.name.split('.')[1];

                                                        const isLoading = loadingStates[perm.id] || false;
                                                        const isChecked = permissionStates[perm.id] || false;
                                                        return (
                                                            <div
                                                            key={perm.id}
                                                            className="flex items-center space-x-2 min-w-[160px]"
                                                          >
                                                            <Switch
                                                            id={`perm-${perm.id}`}
                                                            onCheckedChange={(checked) => handlePermissionToggle(perm.id, checked)}
                                                            checked={isChecked}
                                                            disabled={isLoading}
                                                            />
                                                            <Label
                                                              htmlFor={`perm-${perm.id}`}
                                                              className="text-sm font-medium cursor-pointer"
                                                            >
                                                              {name}
                                                            </Label>
                                                          </div>
                                                        );
                                                    })}

                                                </div>
                                              </TableCell>
                                          </TableRow>
                                      ))
                                  ) : (
                                      <TableRow>
                                          <TableCell colSpan={2} className="text-center h-24 text-muted-foreground">
                                              No permission found
                                          </TableCell>
                                      </TableRow>
                                  )}
                              </TableBody>
                          </Table>
                          {permissionGroups?.meta.links && permissionGroups.data.length > 0 && (
                          <div className="mt-4">
                              <Pagination>
                                  <PaginationContent>
                                      {permissionGroups.meta.links.map((link, index) =>
                                              RenderPaginationItem(link,index)
                                      )}
                                  </PaginationContent>
                              </Pagination>
                          </div>
                          )}
                      </CardContent>
                  </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Permission to the role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>Admin Role has all permissions</p>
                        </CardContent>
                    </Card>
                )}

            </div>
        </AuthenticatedLayout>
    );
}
