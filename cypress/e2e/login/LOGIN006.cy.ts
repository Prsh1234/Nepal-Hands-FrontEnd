describe("LOGIN006 - Invalid password format", () => {
    it("should show password validation message", () => {
      cy.visit("/auth");
  
      cy.get("#email").type("test@example.com");
      cy.get("#password").type("wrong");
  
      cy.get('button[type="submit"]').click();
  
      cy.contains(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      ).should("be.visible");
    });
  });