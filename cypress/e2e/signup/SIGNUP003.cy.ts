describe("SIGNUP003 - Existing email", () => {
    it("should show an email already registered message", () => {
      cy.visit("/auth");
      cy.contains("Sign Up").click();
  
      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Doe");
      cy.get("#email").type("shakya.pratyush789@gmail.com");
      cy.get("#password").type("Password123");
  
      cy.contains("button", "Create Account").click();
  
      cy.contains("This email is already registered").should("be.visible");
    });
  });