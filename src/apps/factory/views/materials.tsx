import { useTranslation } from "react-i18next";

export function MaterialsView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.materials.title")}</h2>
    </section>
  );
}
