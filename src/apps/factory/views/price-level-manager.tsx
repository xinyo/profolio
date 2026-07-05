import { useTranslation } from "react-i18next";

export function PriceLevelManagerView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.priceLevelManager.title")}</h2>
    </section>
  );
}
