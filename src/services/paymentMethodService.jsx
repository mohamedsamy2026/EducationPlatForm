import paymentMethods from "../date/paymentMethods";

export async function getActivePaymentMethods() {
  return paymentMethods.filter((paymentMethod) => paymentMethod.isActive);
}

export async function getPaymentMethodById(paymentMethodId) {
  return (
    paymentMethods.find(
      (paymentMethod) =>
        String(paymentMethod.id) === String(paymentMethodId) &&
        paymentMethod.isActive,
    ) ?? null
  );
}
