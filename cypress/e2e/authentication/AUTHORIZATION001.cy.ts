describe("TC012 - Authorization: Normal user accesses admin endpoint", () => {

    it("should deny normal user access to admin endpoint", () => {
  
      cy.visit("/auth");
  
      cy.get("#email")
        .type("shakya.pratyush789@gmail.com");
  
      cy.get("#password")
        .type("NewPassword1");
  
  
      cy.get('button[type="submit"]')
        .click();
  
  
      cy.url()
        .should("include", "/profile");
  
  
      // Try admin route
      cy.visit("/admin/approvals");
  
  
      // ProtectedRoute redirects unauthorized user
      cy.url()
        .should("include", "/dashboard");
  
  
      // Verify dashboard loaded
      cy.contains("Welcome back")
        .should("exist");
  
    });
  
  });