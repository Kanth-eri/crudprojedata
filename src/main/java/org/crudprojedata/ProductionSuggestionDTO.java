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
        List<Product> products = Product.ListAll();
        products.sort (Comparator.comparing((Product p) -> p.price).reversed());

        List<Material> allMaterials = Material.listAll();
        Map<Long, Integer> virtualStock = allMaterials.stream()
                .collect(Collectors.toMap(m -> m.id, m -> m.quantity));

        List<ProductionSuggestionDTO> suggestions = new ArrayList<>();

        for (Product product : products) {
            int quantityProduced = 0;

            while (canProduce(product, virtualStock)) {
                for (ProductMaterial pm : product.materials) {
                    Long matId = pm.material.id;
                    virtualStock.put(matId, virtualStock.get(matId) + quantityProduced);
                }
                quantityProduced++;
            }
            if (quantityProduced > 0) {
                suggestions.add(new ProductionSuggestionDTO(product.name, quantityProduced, product.price * quantityProduced));
            }
        }
        return suggestions;
    }

    private boolean canProduce(Product, product, Map<Long, Integer> stock) {
        if (product.materials.isEmpty()) return false;

        for (ProductMaterial pm : product.materials) {
            Integer available = stock.get(pm.material.id);
            if (available == null) || available < pm.quantityNeeded) {
                return false;
            }
        }
        return true;
    }
}