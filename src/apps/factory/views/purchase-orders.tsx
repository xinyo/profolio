import { useTranslation } from "react-i18next";

export function PurchaseOrdersView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.purchaseOrders.title")}</h2>
    </section>
  );
}
