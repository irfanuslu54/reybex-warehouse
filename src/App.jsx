import { useState } from "react";
import warehouseData from "./data/warehouse.json";

const COLORS = {
  green: "#2ecc71",
  yellow: "#f1c40f",
  red: "#e74c3c",
};

function getFillRatio(used, capacity) {
  return used / capacity;
}

function getBackgroundColor(ratio) {
  if (ratio >= 0.8) return COLORS.red;
  if (ratio >= 0.5) return COLORS.yellow;
  return COLORS.green;
}

export default function App() {
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

  return (
    <div style={styles.page}>
      <h1>Reybex Warehouse</h1>
      <p style={{ opacity: 0.7 }}>Toplam 3 depo • Ortalama doluluk %65</p>

      <WarehouseGrid
        warehouses={warehouseData}
        selected={selectedWarehouse}
        onSelect={setSelectedWarehouse}
      />

      {selectedWarehouse && <WarehouseDetail warehouse={selectedWarehouse} />}
    </div>
  );
}

function WarehouseGrid({ warehouses, selected, onSelect }) {
  return (
    <div style={styles.grid}>
      {warehouses.map((warehouse) => {
        const ratio = getFillRatio(warehouse.used, warehouse.capacity);

        return (
          <WarehouseCard
            key={warehouse.id}
            warehouse={warehouse}
            ratio={ratio}
            isSelected={selected?.id === warehouse.id}
            onClick={() => onSelect(warehouse)}
          />
        );
      })}
    </div>
  );
}

function WarehouseCard({ warehouse, ratio, isSelected, onClick }) {
  const backgroundColor = getBackgroundColor(ratio);

  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        backgroundColor,
        border: isSelected ? "3px solid #2c3e50" : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <h3>{warehouse.name}</h3>

      {ratio >= 0.8 && <div style={styles.critical}>⚠️ KRİTİK</div>}

      <div>Kapasite: {warehouse.capacity}</div>
      <div>Dolu: {warehouse.used}</div>
      <div>Doluluk: %{Math.round(ratio * 100)}</div>

      <ProgressBar percent={Math.round(ratio * 100)} />
    </div>
  );
}

function ProgressBar({ percent }) {
  return (
    <div style={styles.progressOuter}>
      <div
        style={{
          ...styles.progressInner,
          width: `${percent}%`,
        }}
      />
    </div>
  );
}

function WarehouseDetail({ warehouse }) {
  return (
    <div style={styles.detail}>
      <h2>{warehouse.name} - Ürünler</h2>

      <div style={styles.detailInfo}>
        <strong>Kapasite:</strong> {warehouse.capacity} | <strong>Dolu:</strong>{" "}
        {warehouse.used} | <strong>Kalan:</strong>{" "}
        {warehouse.capacity - warehouse.used}
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Ürün</th>
            <th>Adet</th>
          </tr>
        </thead>
        <tbody>
          {warehouse.products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  page: {
    padding: 24,
    fontFamily: "Arial",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginTop: 24,
    maxWidth: 900,
    marginInline: "auto",
  },

  card: {
    padding: 18,
    borderRadius: 14,
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  critical: {
    fontWeight: "bold",
    marginBottom: 6,
  },
  progressOuter: {
    marginTop: 8,
    height: 10,
    background: "rgba(0,0,0,0.2)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressInner: {
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    borderRadius: 6,
    transition: "width 0.6s ease",
  },

  detail: {
    marginTop: 32,
    padding: 20,
    borderRadius: 14,
    background: "#2b2b2b",
    color: "#f1f1f1",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
  },

  detailInfo: {
    marginBottom: 16,
    color: "#ddd",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    color: "#ddd",
  },
  td: {
    color: "#eee",
  },
};
