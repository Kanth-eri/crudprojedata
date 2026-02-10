import { useEffect } from 'react';
import { Factory, RefreshCw, TrendingUp, Package, DollarSign } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchProductionSuggestions } from '@/store/slices/productionSlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function ProductionPage() {
  const dispatch = useAppDispatch();
  const { suggestions, loading } = useAppSelector((state) => state.production);

  useEffect(() => {
    dispatch(fetchProductionSuggestions());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchProductionSuggestions());
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalQuantity = suggestions.reduce((sum, s) => sum + s.quantity, 0);
  const totalValue = suggestions.reduce((sum, s) => sum + s.totalValue, 0);

  return (
    <MainLayout>
      <PageHeader
        title="Production Suggestions"
        description="Optimized production plan based on available materials (prioritized by highest value)"
        actions={
          <Button onClick={handleRefresh} variant="outline" className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        }
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="stat-card bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/20">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Products to Produce</p>
              <p className="text-2xl font-bold">{suggestions.length}</p>
            </div>
          </div>
        </Card>
        <Card className="stat-card bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-accent/20">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Units</p>
              <p className="text-2xl font-bold">{totalQuantity}</p>
            </div>
          </div>
        </Card>
        <Card className="stat-card bg-gradient-to-br from-success/5 to-success/10 border-success/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/20">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Revenue</p>
              <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Factory className="h-5 w-5 text-primary" />
            Production Plan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : suggestions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Factory className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No production suggestions</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                There are no products that can be produced with the current stock levels.
                Check your material inventory and product configurations.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[60px]">#</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Total Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {suggestions.map((suggestion, index) => (
                    <TableRow key={index} className="animate-fade-in">
                      <TableCell>
                        <Badge
                          variant={index === 0 ? 'default' : 'outline'}
                          className={index === 0 ? 'bg-accent hover:bg-accent/90' : ''}
                        >
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {suggestion.productName}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1 bg-secondary rounded-full font-semibold">
                          {suggestion.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-bold text-success">
                        {formatCurrency(suggestion.totalValue)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Total Row */}
              <div className="flex justify-between items-center p-4 bg-muted/50 border-t">
                <span className="font-semibold text-lg">Total</span>
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Units</p>
                    <p className="font-bold text-lg">{totalQuantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Revenue</p>
                    <p className="font-bold text-lg text-success">
                      {formatCurrency(totalValue)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="mt-6 bg-muted/30">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="font-medium mb-1">Optimization Strategy</h4>
              <p className="text-sm text-muted-foreground">
                Products are prioritized by value (highest first). The system calculates the
                maximum quantity that can be produced with available materials, ensuring
                optimal resource utilization and maximum revenue.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
}
