describe("SIGNUP004 - Invalid email format", () => {
    it("should show browser email validation", () => {
      cy.visit("/auth");
  
      cy.contains("Sign Up").click();
  
      cy.get("#firstName").type("John");
      cy.get("#lastName").type("Doe");
      cy.get("#email").type("invalid-email");
      cy.get("#password").type("Password123");
  
      cy.contains("button", "Create Account").click();
  
      cy.get("#email")
        .then(($input) => {
          expect(($input[0] as HTMLInputElement).validationMessage)
            .to.contain("Please include");
        });
    });
  });