package org.crudprojedata;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("/materials")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class MaterialResource {

    @GET
    public List<Material> listAll() {
        return Material.listAll();
    }

    @POST
    @Transactional
    public Response create(Material material) {
        material.persist();
        return Response.status(Response.Status.CREATED).entity(material).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Material update(@PathParam("id") Long id, Material material) {
        Material entity = Material.findById(id);

        if (entity == null) {
            throw new NotFoundException("Material não encontrado");
        }

        entity.name = material.name;
        entity.stockQuantity = material.stockQuantity;
        return entity;
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public void delete(@PathParam("id") Long id) {
        boolean deleted = Material.deleteById(id);

        if (!deleted) {
            throw new NotFoundException("Material não encontrado");
        }
    }
}