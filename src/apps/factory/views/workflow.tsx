import { useTranslation } from "react-i18next";

export function WorkflowView() {
  const { t } = useTranslation();

  return (
    <section className="factory-view">
      <h2>{t("factory.views.workflow.title")}</h2>
    </section>
  );
}
