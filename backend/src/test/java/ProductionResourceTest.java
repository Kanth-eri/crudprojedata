package org.crudprojedata;

import io.quarkus.test.junit.QuarkusIntegrationTest;
import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.Matchers.hasSize;

@QuarkusTest
public class ProductionResourceTest {

    @Test
    public void testProducctionSuggestEndpoint() {
        given()
                .when().get("/production/suggest")
                .then()
                .statusCode(200);
    }

    @Test
    public void testLogicPriorization() {
        given()
                .when().get("production/suggest")
                .then()
                .statusCode(200)
                .body("$.size()", is(Math.toIntExact(Product.count() > 0 ? suggestionSize() : 0)));
    }

    private int suggestionSize() {
        return 1;
    }
}
