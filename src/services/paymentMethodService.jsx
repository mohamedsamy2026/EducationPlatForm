import paymentMethods from "../data/paymentMethods";

export async function getActivePaymentMethods() {
  return paymentMethods.filter((paymentMethod) => paymentMethod.isActive);
}

export async function getPaymentMethodById(paymentMethodId) {
  return (
    paymentMethods.find(
      (paymentMethod) =>
        String(paymentMethod.id) === String(paymentMethodId) && paymentMethod.isActive,
    ) ?? null
  );
}

// خدمات لوحة المستر
export async function getAllPaymentMethods() {
  return paymentMethods.map((paymentMethod) => ({ ...paymentMethod }));
}

export async function updatePaymentMethod(paymentMethodId, patch) {
  const paymentMethod = paymentMethods.find((item) => String(item.id) === String(paymentMethodId));

  if (!paymentMethod) throw new Error("طريقة الدفع غير موجودة.");

  Object.assign(paymentMethod, patch);

  return { ...paymentMethod };
}
