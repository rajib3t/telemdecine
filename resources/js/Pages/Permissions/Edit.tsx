import React, { useEffect, useState, FormEventHandler } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head , usePage, useForm, router} from '@inertiajs/react';
import { PageProps} from '@/types';
import {PermissionGroupInterface} from '@/Interfaces/PermissionInterface';
import {FlashMessageState} from '@/Interfaces/FlashMessageState';
import {FlashMessage} from '@/Components/FlashMessage';
import BreadcrumbComponent from '@/Components/Breadcrumb';
import { Search , RotateCcw} from 'lucide-react';
import RenderPaginationItem from '@/Components/RenderPaginationItem';
import {PermissionInterface} from '@/Interfaces/PermissionInterface';
import axios from 'axios';
// Shadcn  Component Card
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
import {
    Pagination,
    PaginationContent
} from "@/Components/ui/pagination";
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
// Shadcn Form property
import { Input } from '@/Components/ui/input';
import { Label } from  '@/Components/ui/label';
import {Textarea } from '@/Components/ui/textarea';
import { RoleInterface, RoleListInterface } from '@/Interfaces/RoleInterface';
// For Toast import shadcn toast
import { useToast } from "@/hooks/use-toast"
interface EditProps {
    permissionGroup: {
        data : PermissionGroupInterface
    } ;
    roles:RoleListInterface
    filters?:any

}

// Global Page Property
interface ExtendedPageProps extends PageProps {
    flash?: {
        success?: string;
        error?: any;
    };
}

export default function EditPermission({permissionGroup, roles, filters}:EditProps) {
    console.log(roles);
    const { toast } = useToast();
    // Page Props
    const { props } = usePage<ExtendedPageProps>();
    // Extract flash message  from property
    const { flash } = props;
    // Flash Message
    const [flashMessage, setFlashMessage] = useState<FlashMessageState | null>(null);
    // Set Flash Message
    useEffect(() => {
        if (flash?.success || flash?.error) {
            const type = flash.success ? "success" : "error";
            const message = flash.success || flash.error || "";
            setFlashMessage({ type, message });

            const timer = setTimeout(() => setFlashMessage(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: permissionGroup.data.name,
            description: permissionGroup.data.description || undefined
        });
    const submit: FormEventHandler = (e) => {

            e.preventDefault();
            patch(route('permission.update', permissionGroup.data.id))

        };
        const [searchParams, setSearchParams] = useState({
                    name: filters?.name   || '' ,

                });
    // Search handle
        const handleSearch = (e: React.FormEvent) => {
            e.preventDefault();
            router.get(
                route('permission.edit', permissionGroup.data.id),
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
                route('permission.edit', permissionGroup.data.id),
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
    const [permissionStates, setPermissionStates] = useState<Record<number,  boolean>>({});
    // Initialize permission states from role data
    useEffect(() => {
        console.log(permissionGroup);

        const initialStates = permissionGroup.data.permissions?.reduce((acc, perm) => ({

            ...acc,
            [perm.id]: true
        }), {}) || {};
        setPermissionStates(initialStates);
    }, [permissionGroup.data.permissions]);
    const handlePermissionToggle = async (permId: number, roleId: number, checked: boolean) => {
        setLoadingStates(prev => ({ ...prev, [permId]: true }));

        try {
            const response = await axios.patch(route('permission.add.role', permissionGroup.data.id), {
                permission: permId.toString(),
                role: roleId.toString(),
                checked: checked,
                _method: 'PATCH'
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });

            if (response.status === 200) {
                router.reload();
                toast({
                    title: 'Success',
                    description: response.data.message,
                });
            }
        } catch (error) {
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
            { name: "Dashboard", href: route('dashboard.index') },
            { name: "Permissions", href: route('permission.index') },
            { name: "Edit", href: null },
    ];
    return (
        <AuthenticatedLayout>
            <Head title={`Edit Permission :  ${permissionGroup.data.name} `} />
            <div className="space-y-6">
            <BreadcrumbComponent breadcrumbs={breadcrumbs} key='permission-edit' />
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
                        <CardTitle>Edit Permission : {permissionGroup.data.name }</CardTitle>
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
                                        disabled

                                    />
                                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={e => setData('description', e.target.value)}
                                        placeholder="Permission description"
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
                <Card>
                    <CardHeader>
                        <CardTitle>Add role to the permission</CardTitle>
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
                                        className="w-full sm:w-auto"
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
                                  {roles?.data?.length ? (
                                      roles.data.map((role: RoleInterface) => (

                                          <TableRow key={role.id}>

                                              <TableCell>{role.name}{role.permissions?.some((e)=> console.log(e.id))}</TableCell>
                                              <TableCell>
                                                {role.name != 'Admin' ? (
                                                    <div className="flex gap-2">
                                                        {permissionGroup.data.permissions.map((perm: PermissionInterface) => {
                                                            const name = perm.name.split('.')[1];
                                                            const isLoading = loadingStates[perm.id] || false;

                                                            return (
                                                                <div key={perm.id} className="flex items-center space-x-2 min-w-[160px]">
                                                                    <Switch
                                                                        id={`perm-${perm.id}`}
                                                                        onCheckedChange={(checked) => handlePermissionToggle(perm.id, role.id, checked)}
                                                                        checked={role.permissions?.some((p: PermissionInterface) => p.id === perm.id)}
                                                                        disabled={isLoading}
                                                                    />
                                                                    <Label htmlFor={`perm-${perm.id}`} className="text-sm font-medium cursor-pointer">
                                                                        {name}
                                                                    </Label>
                                                                </div>
                                                            );
                                                        })}

                                                    </div>
                                                ):(
                                                    <div className="flex gap-2">

                                                        Admin User has All permissions

                                                    </div>
                                                )}

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
                          {roles?.meta.links && roles.data.length > 0 && (
                          <div className="mt-4">
                              <Pagination>
                                  <PaginationContent>
                                      {roles.meta.links.map((link, index) =>
                                              RenderPaginationItem(link,index)
                                      )}
                                  </PaginationContent>
                              </Pagination>
                          </div>
                          )}
                    </CardContent>
                </Card>
            </div>


        </AuthenticatedLayout>
    );
}
