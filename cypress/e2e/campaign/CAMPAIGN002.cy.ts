describe("CAMPAIGN002 - Submit incomplete campaign details", () => {
    it("should prevent moving forward with incomplete campaign details", () => {
  
      // Login
      cy.visit("/auth");
  
      cy.get("#email")
        .type("shakya.pratyush789@gmail.com");
  
      cy.get("#password")
        .type("NewPassword1");
  
      cy.get('button[type="submit"]')
        .click();
  
      cy.url()
        .should("include", "/profile");
  
  
      // Open create campaign
      cy.visit("/organizer/campaign/create");
  
  
      // Step 1: Leave required fields empty
      cy.contains("Continue")
        .should("be.disabled");
  
  
      // Enter only title
      cy.get("#campaign-title")
        .type("Incomplete Campaign Test");
  
  
      // Continue should still be disabled
      cy.contains("Continue")
        .should("be.disabled");
  
  
      // Select category
      cy.contains("Water & Sanitation")
        .click();
  
  
      // Continue still disabled because location missing
      cy.contains("Continue")
        .should("be.disabled");
  
  
      // Enter location
      cy.get("#campaign-location")
        .type("Kathmandu");
  
  
      // Now step can proceed
      cy.contains("Continue")
        .should("not.be.disabled");
  
  
      cy.contains("Continue")
        .click();
  
  
      // Step 2 validation
      // Leave story fields empty
      cy.contains("Continue")
        .should("be.disabled");
  
  
      // Enter short description only
      cy.get("textarea")
        .eq(0)
        .type("Short description");
  
  
      // Still disabled because long description and project scope missing
      cy.contains("Continue")
        .should("be.disabled");
  
  
      // Verify validation behavior
      cy.contains("Story")
        .should("exist");
  
    });
  });