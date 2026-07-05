import { useTranslation } from "react-i18next";

export function DeliverySchedulingView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.deliveryScheduling.title")}</h2>
    </section>
  );
}
