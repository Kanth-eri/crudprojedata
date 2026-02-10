import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Package, AlertCircle } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMaterials } from '@/store/slices/materialsSlice';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/store/slices/productsSlice';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product, ProductMaterial } from '@/types';

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  price: z.number().min(0, 'Price must be positive'),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { items: products, loading } = useAppSelector((state) => state.products);
  const { items: materials } = useAppSelector((state) => state.materials);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productMaterials, setProductMaterials] = useState<
    { materialId: number; quantityNeeded: number }[]
  >([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: 0 },
  });

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMaterials());
  }, [dispatch]);

  const openCreateDialog = () => {
    setSelectedProduct(null);
    setProductMaterials([]);
    form.reset({ name: '', price: 0 });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    form.reset({ name: product.name, price: product.price });
    setProductMaterials(
      product.materials?.map((pm) => ({
        materialId: pm.material.id,
        quantityNeeded: pm.quantityNeeded,
      })) || []
    );
    setIsDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const addMaterialRow = () => {
    const unusedMaterial = materials.find(
      (m) => !productMaterials.some((pm) => pm.materialId === m.id)
    );
    if (unusedMaterial) {
      setProductMaterials([
        ...productMaterials,
        { materialId: unusedMaterial.id, quantityNeeded: 1 },
      ]);
    }
  };

  const removeMaterialRow = (index: number) => {
    setProductMaterials(productMaterials.filter((_, i) => i !== index));
  };

  const updateMaterialRow = (
    index: number,
    field: 'materialId' | 'quantityNeeded',
    value: number
  ) => {
    const updated = [...productMaterials];
    updated[index][field] = value;
    setProductMaterials(updated);
  };

  const onSubmit = async (values: ProductFormValues) => {
    const productData = {
      name: values.name,
      price: values.price,
      materials: productMaterials.map((pm) => ({
        material: { id: pm.materialId },
        quantityNeeded: pm.quantityNeeded,
      })),
    };

    if (selectedProduct) {
      await dispatch(updateProduct({ id: selectedProduct.id, product: { name: values.name, price: values.price } }));
    } else {
      await dispatch(createProduct(productData));
    }

    setIsDialogOpen(false);
    dispatch(fetchProducts());
  };

  const handleDelete = async () => {
    if (selectedProduct) {
      await dispatch(deleteProduct(selectedProduct.id));
      setIsDeleteOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <MainLayout>
      <PageHeader
        title="Products"
        description="Manage your product catalog and material requirements"
        actions={
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            New Product
          </Button>
        }
      />

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No products yet</h3>
              <p className="text-muted-foreground mt-1">
                Create your first product to get started
              </p>
              <Button onClick={openCreateDialog} className="mt-4">
                Create Product
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Materials</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id} className="animate-fade-in">
                      <TableCell className="font-mono text-sm">
                        #{product.id}
                      </TableCell>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell className="font-semibold text-primary">
                        {formatCurrency(product.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.materials?.length > 0 ? (
                            product.materials.slice(0, 3).map((pm, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {pm.material.name} ({pm.quantityNeeded})
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">
                              No materials
                            </span>
                          )}
                          {product.materials?.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.materials.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDeleteDialog(product)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  {...form.register('name')}
                />
                {form.formState.errors.name && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (R$)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('price', { valueAsNumber: true })}
                />
                {form.formState.errors.price && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Materials Section - only for new products */}
            {!selectedProduct && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base">Required Materials</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMaterialRow}
                    disabled={productMaterials.length >= materials.length}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Material
                  </Button>
                </div>

                {productMaterials.length === 0 ? (
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg text-sm text-muted-foreground">
                    <AlertCircle className="h-4 w-4" />
                    No materials added. Add materials required for production.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {productMaterials.map((pm, index) => (
                      <div
                        key={index}
                        className="flex gap-3 items-center p-3 border rounded-lg bg-muted/30"
                      >
                        <div className="flex-1">
                          <Select
                            value={pm.materialId.toString()}
                            onValueChange={(val) =>
                              updateMaterialRow(index, 'materialId', Number(val))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent>
                              {materials.map((m) => (
                                <SelectItem key={m.id} value={m.id.toString()}>
                                  {m.name} (Stock: {m.stockQuantity})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-32">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            value={pm.quantityNeeded}
                            onChange={(e) =>
                              updateMaterialRow(
                                index,
                                'quantityNeeded',
                                Number(e.target.value)
                              )
                            }
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMaterialRow(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedProduct ? 'Save Changes' : 'Create Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action
              cannot be undone.
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
