import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Boxes, Package2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
} from '@/store/slices/materialsSlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import type { Material } from '@/types';

const materialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  stockQuantity: z.number().min(0, 'Quantity must be 0 or greater'),
});

type MaterialFormValues = z.infer<typeof materialSchema>;

export default function MaterialsPage() {
  const dispatch = useAppDispatch();
  const { items: materials, loading } = useAppSelector((state) => state.materials);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);

  const form = useForm<MaterialFormValues>({
    resolver: zodResolver(materialSchema),
    defaultValues: { name: '', stockQuantity: 0 },
  });

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const openCreateDialog = () => {
    setSelectedMaterial(null);
    form.reset({ name: '', stockQuantity: 0 });
    setIsDialogOpen(true);
  };

  const openEditDialog = (material: Material) => {
    setSelectedMaterial(material);
    form.reset({ name: material.name, stockQuantity: material.stockQuantity });
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (material: Material) => {
    setSelectedMaterial(material);
    setIsDeleteOpen(true);
  };

  const onSubmit = async (values: MaterialFormValues) => {
    const materialData = {
      name: values.name,
      stockQuantity: values.stockQuantity,
    };

    if (selectedMaterial) {
      await dispatch(updateMaterial({ id: selectedMaterial.id, material: materialData }));
    } else {
      await dispatch(createMaterial(materialData));
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (selectedMaterial) {
      await dispatch(deleteMaterial(selectedMaterial.id));
      setIsDeleteOpen(false);
    }
  };

  const getStockLevel = (quantity: number): { label: string; color: string; percent: number } => {
    if (quantity === 0) return { label: 'Out of Stock', color: 'destructive', percent: 0 };
    if (quantity < 10) return { label: 'Low Stock', color: 'warning', percent: 25 };
    if (quantity < 50) return { label: 'Medium', color: 'secondary', percent: 50 };
    return { label: 'In Stock', color: 'success', percent: 100 };
  };

  return (
    <MainLayout>
      <PageHeader
        title="Materials"
        description="Manage raw materials and inventory stock levels"
        actions={
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            New Material
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="stat-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Package2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Materials</p>
              <p className="text-2xl font-bold">{materials.length}</p>
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <Boxes className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Stock</p>
              <p className="text-2xl font-bold">
                {materials.reduce((sum, m) => sum + m.stockQuantity, 0)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/10">
              <Boxes className="h-6 w-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Items</p>
              <p className="text-2xl font-bold">
                {materials.filter((m) => m.stockQuantity < 10).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : materials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Boxes className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No materials yet</h3>
              <p className="text-muted-foreground mt-1">
                Add your first raw material to start tracking inventory
              </p>
              <Button onClick={openCreateDialog} className="mt-4">
                Add Material
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Stock Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materials.map((material) => {
                    const stock = getStockLevel(material.stockQuantity);
                    return (
                      <TableRow key={material.id} className="animate-fade-in">
                        <TableCell className="font-mono text-sm">
                          #{material.id}
                        </TableCell>
                        <TableCell className="font-medium">{material.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold w-12">
                              {material.stockQuantity}
                            </span>
                            <Progress value={stock.percent} className="w-24 h-2" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              stock.color === 'success'
                                ? 'default'
                                : stock.color === 'destructive'
                                ? 'destructive'
                                : 'secondary'
                            }
                            className={
                              stock.color === 'success'
                                ? 'bg-success hover:bg-success/90'
                                : stock.color === 'warning'
                                ? 'bg-warning hover:bg-warning/90'
                                : ''
                            }
                          >
                            {stock.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(material)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openDeleteDialog(material)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedMaterial ? 'Edit Material' : 'Create New Material'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Material Name</Label>
              <Input
                id="name"
                placeholder="Enter material name"
                {...form.register('name')}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                min="0"
                placeholder="0"
                {...form.register('stockQuantity', { valueAsNumber: true })}
              />
              {form.formState.errors.stockQuantity && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.stockQuantity.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedMaterial ? 'Save Changes' : 'Create Material'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedMaterial?.name}"? This action
              cannot be undone and may affect products using this material.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
