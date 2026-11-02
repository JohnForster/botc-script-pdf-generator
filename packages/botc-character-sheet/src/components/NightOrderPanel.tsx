import { NightOrders } from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightOrderPanel.css";
import { useTranslation } from "../translations/context";

type NightOrderPanelProps = {
  nightOrders: NightOrders;
  iconUrlTemplate?: string;
};

export const NightOrderPanel = (props: NightOrderPanelProps) => {
  const { t } = useTranslation();
  const firstNightOrder = props.nightOrders.first;
  const otherNightOrder = props.nightOrders.other;
  return (
    <div class="night-orders-container">
      <div class="night-order">
        <p>{t('ui', 'first_night') || 'First Night:'}</p>
        <div class="icon-row">
          {firstNightOrder.map((item) => (
            <img
              src={getImageSrc(item, props.iconUrlTemplate)}
              class={typeof item === "string" ? "icon marker-icon" : "icon"}
            ></img>
          ))}
        </div>
      </div>
      <div class="night-order">
        <p>{t('ui', 'other_nights') || 'Other Nights:'}</p>
        <div class="icon-row">
          {otherNightOrder.map((item) => (
            <img
              src={getImageSrc(item, props.iconUrlTemplate)}
              class={typeof item === "string" ? "icon marker-icon" : "icon"}
            ></img>
          ))}
        </div>
      </div>
    </div>
  );
};
