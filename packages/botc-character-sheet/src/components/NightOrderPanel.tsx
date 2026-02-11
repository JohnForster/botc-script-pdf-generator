import { NightOrders } from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightOrderPanel.css";

type NightOrderPanelProps = {
  nightOrders: NightOrders;
  iconUrlTemplate?: string;
};

export const NightOrderPanel = (props: NightOrderPanelProps) => {
  const firstNightOrder = props.nightOrders.first;
  const otherNightOrder = props.nightOrders.other;
  return (
    <div class="night-orders-container">
      <div class="night-order">
        <p>First Night:</p>
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
        <p>Other Nights:</p>
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
