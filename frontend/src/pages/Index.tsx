import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Boxes, Factory, TrendingUp, ArrowRight, BarChart3 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProducts } from '@/store/slices/productsSlice';
import { fetchMaterials } from '@/store/slices/materialsSlice';
import { fetchProductionSuggestions } from '@/store/slices/productionSlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const dispatch = useAppDispatch();
  const { items: products, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );
  const { items: materials, loading: materialsLoading } = useAppSelector(
    (state) => state.materials
  );
  const { suggestions, loading: productionLoading } = useAppSelector(
    (state) => state.production
  );

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchMaterials());
    dispatch(fetchProductionSuggestions());
  }, [dispatch]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalProductValue = products.reduce((sum, p) => sum + p.price, 0);
  const totalStock = materials.reduce((sum, m) => sum + m.stockQuantity, 0);
  const lowStockCount = materials.filter((m) => m.stockQuantity < 10).length;
  const expectedRevenue = suggestions.reduce((sum, s) => sum + s.totalValue, 0);

  const isLoading = productsLoading || materialsLoading || productionLoading;

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of your inventory and production status
        </p>
      </div>


      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{products.length}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Boxes className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Materials</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{materials.length}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-success/5 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <BarChart3 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stock</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{totalStock}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-destructive/5 rounded-full -translate-y-8 translate-x-8" />
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <TrendingUp className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{lowStockCount}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Production Summary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              Production Potential
            </CardTitle>
            <Link to="/production">
              <Button variant="ghost" size="sm" className="gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Factory className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p>No production possible with current stock</p>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {suggestions.slice(0, 4).map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{suggestion.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.quantity} units
                          </p>
                        </div>
                      </div>
                      <p className="font-bold text-success">
                        {formatCurrency(suggestion.totalValue)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="text-muted-foreground">Expected Revenue</span>
                  <span className="text-xl font-bold text-success">
                    {formatCurrency(expectedRevenue)}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link to="/products" className="block">
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Manage Products</p>
                  <p className="text-sm text-muted-foreground">
                    Add, edit or remove products
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>

            <Link to="/materials" className="block">
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-3 rounded-lg bg-accent/10">
                  <Boxes className="h-5 w-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Manage Materials</p>
                  <p className="text-sm text-muted-foreground">
                    Update inventory stock levels
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>

            <Link to="/production" className="block">
              <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                <div className="p-3 rounded-lg bg-success/10">
                  <Factory className="h-5 w-5 text-success" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">View Production Plan</p>
                  <p className="text-sm text-muted-foreground">
                    See optimized production suggestions
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Index;