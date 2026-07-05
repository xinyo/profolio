import { useTranslation } from "react-i18next";

export function SalesOrdersView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.salesOrders.title")}</h2>
    </section>
  );
}
