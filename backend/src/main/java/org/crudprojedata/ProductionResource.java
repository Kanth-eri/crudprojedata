package org.crudprojedata;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.*;
import java.util.stream.Collectors;

@Path("/production")
@Produces(MediaType.APPLICATION_JSON)
public class ProductionResource {
    @GET
    @Path("/suggest")
    public List<ProductionSuggestionDTO> suggestProduction() {
        List<Product> products = Product.listAll();
        products.sort(Comparator.comparing((Product p) -> p.price).reversed());

        List<Material> allMaterials = Material.listAll();
        Map<Long, Integer> virtualStock = allMaterials.stream()
                .collect(Collectors.toMap(m -> m.id, m -> m.stockQuantity));

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

        for (Product product : products) {
            int count = 0;

            while (canProduce(product, virtualStock)) {
                for (ProductMaterial pm : product.materials) {
                    Long matId = pm.material.id;
                    virtualStock.put(matId, virtualStock.get(matId) - pm.quantityNeeded);
                }
                count++;
            }

            if (count > 0) {
                suggestions.add(new ProductionSuggestionDTO(product.name, count, product.price * count));
            }
        }
        return suggestions;
    }

    private boolean canProduce(Product product, Map<Long, Integer> stock) {
        if (product.materials == null || product.materials.isEmpty()) return false;

        for (ProductMaterial pm : product.materials) {
            Integer available = stock.get(pm.material.id);
            if (available == null || available < pm.quantityNeeded) {
                return false;
            }
        }
        return true;
    }
}