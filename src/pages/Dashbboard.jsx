import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  AlertTriangle,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import api from "@/api/api";
import ENDPOINTS from "@/api/endpoints";

const normalizeListData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatus = (remainingQuantity) => {
  const quantity = Number(remainingQuantity ?? 0);

  if (quantity === 0) return "Habis";
  if (quantity <= 10) return "Kritis";
  if (quantity <= 20) return "Menipis";
  return "Normal";
};

const getMonthKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const getMonthLabel = (date) => {
  const labels = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return labels[date.getMonth()];
};

const getTransactionDate = (item) =>
  item.transaction_date ||
  item.created_at ||
  item.date ||
  item.received_date ||
  item.updated_at ||
  item.expired_date ||
  "";

const getDocumentNumber = (item) =>
  item.document_number ||
  item.doc_number ||
  item.reference_number ||
  item.documentNo ||
  item.id ||
  "-";

const getProductName = (item) =>
  item.product_name ||
  item.productName ||
  item.product?.name ||
  item.name ||
  item.product ||
  "-";

const getQuantityValue = (item) => Number(item.quantity ?? item.qty ?? item.total_quantity ?? item.amount ?? 0);

const getPetugasName = (item) =>
  item.user_name ||
  item.user?.username ||
  item.user?.name ||
  item.created_by ||
  item.staff_name ||
  item.operator ||
  "-";

export default function Dashbboard() {
  const [stockBatches, setStockBatches] = useState([]);
  const [inbounds, setInbounds] = useState([]);
  const [outbounds, setOutbounds] = useState([]);
  const [expiredAlert, setExpiredAlert] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [stockBatchResponse, inboundResponse, outboundResponse, expiredResponse] = await Promise.all([
          api.get(ENDPOINTS.STOCK_BATCH),
          api.get(ENDPOINTS.INBOUND),
          api.get(ENDPOINTS.OUTBOUND),
          api.get(ENDPOINTS.EXPIRED_ALERT),
        ]);

        setStockBatches(normalizeListData(stockBatchResponse.data));
        setInbounds(normalizeListData(inboundResponse.data));
        setOutbounds(normalizeListData(outboundResponse.data));
        setExpiredAlert(normalizeListData(expiredResponse.data));
      } catch (error) {
        console.error("Gagal mengambil data dashboard", error);
        setStockBatches([]);
        setInbounds([]);
        setOutbounds([]);
        setExpiredAlert([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalBarang = stockBatches.length;
    const barangMasuk = inbounds.length;
    const barangKeluar = outbounds.length;
    const stokKritis = stockBatches.filter((item) => Number(item.remaining_quantity ?? item.remainingQuantity ?? 0) <= 10).length;

    return { totalBarang, barangMasuk, barangKeluar, stokKritis };
  }, [stockBatches, inbounds, outbounds]);

  const months = useMemo(() => {
    const result = [];
    const now = new Date();

    for (let index = 5; index >= 0; index -= 1) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - index, 1);
      result.push(monthDate);
    }

    return result;
  }, []);

  const monthlyInbound = useMemo(() => {
    const grouped = months.reduce((acc, month) => {
      acc[getMonthKey(month)] = 0;
      return acc;
    }, {});

    inbounds.forEach((item) => {
      const datetime = getTransactionDate(item);
      const date = new Date(datetime);
      if (Number.isNaN(date.getTime())) return;

      const key = getMonthKey(date);
      if (grouped[key] !== undefined) {
        grouped[key] += getQuantityValue(item);
      }
    });

    return months.map((month) => grouped[getMonthKey(month)] ?? 0);
  }, [inbounds, months]);

  const monthlyOutbound = useMemo(() => {
    const grouped = months.reduce((acc, month) => {
      acc[getMonthKey(month)] = 0;
      return acc;
    }, {});

    outbounds.forEach((item) => {
      const datetime = getTransactionDate(item);
      const date = new Date(datetime);
      if (Number.isNaN(date.getTime())) return;

      const key = getMonthKey(date);
      if (grouped[key] !== undefined) {
        grouped[key] += getQuantityValue(item);
      }
    });

    return months.map((month) => grouped[getMonthKey(month)] ?? 0);
  }, [outbounds, months]);

  const chartMaxValue = Math.max(...monthlyInbound, ...monthlyOutbound, 1);
  const xPositions = [60, 140, 220, 300, 380, 460];
  const chartHeight = 200;
  const chartTop = 20;
  const chartBottom = 160;
  const chartRange = chartBottom - chartTop;

  const getYPosition = (value) => chartBottom - (value / chartMaxValue) * chartRange;

  const createPath = (values) => {
    const points = values.map((value, index) => ({ x: xPositions[index], y: getYPosition(value) }));

    if (points.length === 0) return "";

    return points.reduce((path, point, index) => {
      if (index === 0) {
        return `M ${point.x},${point.y}`;
      }

      return `${path} L ${point.x},${point.y}`;
    }, "");
  };

  const inboundPath = useMemo(() => createPath(monthlyInbound), [monthlyInbound]);
  const outboundPath = useMemo(() => createPath(monthlyOutbound), [monthlyOutbound]);

  const inboundPoints = useMemo(
    () => monthlyInbound.map((value, index) => ({ x: xPositions[index], y: getYPosition(value) })),
    [monthlyInbound]
  );

  const outboundPoints = useMemo(
    () => monthlyOutbound.map((value, index) => ({ x: xPositions[index], y: getYPosition(value) })),
    [monthlyOutbound]
  );

  const stockSummary = useMemo(() => {
    const normalCount = stockBatches.filter((item) => getStatus(item.remaining_quantity ?? item.remainingQuantity ?? 0) === "Normal").length;
    const menipisCount = stockBatches.filter((item) => getStatus(item.remaining_quantity ?? item.remainingQuantity ?? 0) === "Menipis").length;
    const kritisCount = stockBatches.filter((item) => getStatus(item.remaining_quantity ?? item.remainingQuantity ?? 0) === "Kritis" || getStatus(item.remaining_quantity ?? item.remainingQuantity ?? 0) === "Habis").length;

    const total = stockBatches.length || 1;
    const normalPercent = Math.round((normalCount / total) * 100);
    const menipisPercent = Math.round((menipisCount / total) * 100);
    const kritisPercent = Math.round((kritisCount / total) * 100);

    return { normalCount, menipisCount, kritisCount, normalPercent, menipisPercent, kritisPercent, total };
  }, [stockBatches]);

  const circumference = 2 * Math.PI * 50;
  const donutSegments = useMemo(() => {
    const segments = [
      {
        color: "#10b981",
        count: stockSummary.normalCount,
        percent: stockSummary.normalPercent,
      },
      {
        color: "#f59e0b",
        count: stockSummary.menipisCount,
        percent: stockSummary.menipisPercent,
      },
      {
        color: "#f43f5e",
        count: stockSummary.kritisCount,
        percent: stockSummary.kritisPercent,
      },
    ];

    let offset = circumference;

    return segments.map((segment) => {
      const dashOffset = offset;
      offset -= (segment.percent / 100) * circumference;
      return { ...segment, dashOffset };
    });
  }, [circumference, stockSummary]);

  const recentTransactions = useMemo(() => {
    const merged = [
      ...inbounds.map((item) => ({
        tanggal: formatDate(getTransactionDate(item)),
        jenis: "Masuk",
        kode: getDocumentNumber(item),
        nama: getProductName(item),
        qty: getQuantityValue(item),
        petugas: getPetugasName(item),
        timestamp: new Date(getTransactionDate(item) || 0).getTime(),
      })),
      ...outbounds.map((item) => ({
        tanggal: formatDate(getTransactionDate(item)),
        jenis: "Keluar",
        kode: getDocumentNumber(item),
        nama: getProductName(item),
        qty: getQuantityValue(item),
        petugas: getPetugasName(item),
        timestamp: new Date(getTransactionDate(item) || 0).getTime(),
      })),
    ].sort((left, right) => right.timestamp - left.timestamp);

    return merged.slice(0, 10);
  }, [inbounds, outbounds]);

  const criticalItems = useMemo(() => {
    return stockBatches
      .filter((item) => Number(item.remaining_quantity ?? item.remainingQuantity ?? 0) <= 10)
      .sort((left, right) => Number(right.remaining_quantity ?? right.remainingQuantity ?? 0) - Number(left.remaining_quantity ?? left.remainingQuantity ?? 0))
      .slice(0, 5)
      .map((item) => ({
        productName: item.product_name || item.productName || "-",
        remainingQuantity: Number(item.remaining_quantity ?? item.remainingQuantity ?? 0),
        binName: item.bin_name || item.binName || "-",
      }));
  }, [stockBatches]);

  const safeStockCount = useMemo(() => {
    return stockBatches.filter((item) => Number(item.remaining_quantity ?? item.remainingQuantity ?? 0) > 20).length;
  }, [stockBatches]);

  return (
    <div className="space-y-6">
      {/* 4 Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Barang */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-full">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Barang</div>
            <div className="text-3xl font-extrabold text-slate-850 mt-1">{loading ? "..." : stats.totalBarang}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Semua Barang</div>
          </div>
        </div>

        {/* Barang Masuk */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-blue-500/10 text-blue-600 p-3 rounded-full">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Barang Masuk</div>
            <div className="text-3xl font-extrabold text-slate-850 mt-1">{loading ? "..." : stats.barangMasuk}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Bulan Ini</div>
          </div>
        </div>

        {/* Barang Keluar */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-orange-500/10 text-orange-600 p-3 rounded-full">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Barang Keluar</div>
            <div className="text-3xl font-extrabold text-slate-850 mt-1">{loading ? "..." : stats.barangKeluar}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Bulan Ini</div>
          </div>
        </div>

        {/* Stok Kritis */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-rose-500/10 text-rose-600 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok Kritis</div>
            <div className="text-3xl font-extrabold text-rose-600 mt-1">{loading ? "..." : stats.stokKritis}</div>
            <div className="text-[10px] text-rose-600 mt-0.5 font-medium">Perlu Perhatian</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Graph & Stocks Summary */}
      <div className="grid gap-6 xl:grid-cols-[2.5fr_1.1fr]">
        {/* Left Card: Transaction Graph */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Grafik Transaksi 6 Bulan Terakhir</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Tren keluar masuk logistik barang</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Barang Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Barang Keluar
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="160" x2="480" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="15" y="25" fill="#94a3b8" fontSize="8" fontWeight="600">100</text>
              <text x="15" y="65" fill="#94a3b8" fontSize="8" fontWeight="600">75</text>
              <text x="15" y="125" fill="#94a3b8" fontSize="8" fontWeight="600">50</text>
              <text x="15" y="165" fill="#94a3b8" fontSize="8" fontWeight="600">0</text>

              {/* X Axis Labels */}
              {months.map((month, index) => (
                <text key={getMonthKey(month)} x={xPositions[index]} y="180" fill="#94a3b8" fontSize="8" fontWeight="600">
                  {getMonthLabel(month)}
                </text>
              ))}

              {/* Green Line - Barang Masuk */}
              <path d={inboundPath} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" />
              {inboundPoints.map((point, index) => (
                <circle key={`inbound-${index}`} cx={point.x} cy={point.y} r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              ))}

              {/* Orange Line - Barang Keluar */}
              <path d={outboundPath} fill="none" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
              {outboundPoints.map((point, index) => (
                <circle key={`outbound-${index}`} cx={point.x} cy={point.y} r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
        </div>

        {/* Right Card: Ringkasan Stok (Donut chart) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Ringkasan Stok</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Berdasarkan status persediaan</p>
          </div>

          {/* Donut Chart */}
          <div className="relative flex justify-center items-center h-44 my-4">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Outer track */}
              <circle cx="72" cy="72" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />

              {donutSegments.map((segment, index) => (
                <circle
                  key={segment.color}
                  cx="72"
                  cy="72"
                  r="50"
                  fill="transparent"
                  stroke={segment.color}
                  strokeWidth="14"
                  strokeDasharray={circumference}
                  strokeDashoffset={segment.dashOffset}
                  strokeLinecap="round"
                  className={index === 0 ? "" : "transform origin-center rotate-[0deg]"}
                />
              ))}
            </svg>
            <div className="absolute flex flex-col justify-center items-center">
              <span className="text-3xl font-extrabold text-slate-800 leading-none">{loading ? "..." : stockSummary.total}</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">Total</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Stok Normal
              </span>
              <span className="text-slate-800">{loading ? "..." : `${stockSummary.normalCount} (${stockSummary.normalPercent}%)`}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Stok Menipis
              </span>
              <span className="text-slate-800">{loading ? "..." : `${stockSummary.menipisCount} (${stockSummary.menipisPercent}%)`}</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Stok Kritis
              </span>
              <span className="text-slate-800">{loading ? "..." : `${stockSummary.kritisCount} (${stockSummary.kritisPercent}%)`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Transactions & Critical Stock Alert */}
      <div className="grid gap-6 xl:grid-cols-[2.5fr_1.1fr]">
        {/* Left: Recent Transactions Table */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Transaksi Terbaru</h2>
            <Link to="/laporan" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 transition-colors">
              Lihat semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4">Nomor Dokumen</th>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-4 text-right">Jumlah</th>
                  <th className="py-3 px-4">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {recentTransactions.map((tx, idx) => (
                  <tr key={`${tx.jenis}-${tx.kode}-${idx}`} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                    <td className="py-3 px-4 text-slate-400">{tx.tanggal}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tx.jenis === "Masuk" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {tx.jenis}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.kode}</td>
                    <td className="py-3 px-4">{tx.nama}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{tx.qty}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Critical Stock List */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Barang Stok Kritis</h2>
            <Link to="/stok-kritis" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 transition-colors">
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {criticalItems.length > 0 ? (
              criticalItems.map((item, index) => (
                <div key={`${item.productName}-${index}`} className="rounded-xl border border-rose-100 bg-rose-50/20 p-4">
                  <div className="text-xs font-bold text-rose-700 uppercase">{item.productName}</div>
                  <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                    Tersisa {item.remainingQuantity} unit di {item.binName}
                  </div>
                  <Link to="/stok-kritis" className="text-[10px] font-bold text-rose-600 hover:underline mt-2 inline-block">
                    Lihat Semua Stok Kritis →
                  </Link>
                </div>
              ))
            ) : (
              <div className="rounded-xl border border-slate-100 bg-slate-50/20 p-4 text-sm text-slate-500">
                Tidak ada stok kritis saat ini.
              </div>
            )}
          </div>

          <div className="rounded-xl bg-emerald-600 p-4 text-white flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold">Jumlah Barang Aman</div>
              <div className="text-[10px] opacity-80 mt-0.5">{loading ? "..." : `${safeStockCount} barang dengan stok di atas 20 unit`}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid (Bottom) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <Link to="/stok-barang" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Tambah Barang</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Tambah produk baru</div>
          </div>
        </Link>

        <Link to="/barang-masuk" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-blue-500/10 text-blue-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Barang Masuk</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Pemasukan gudang</div>
          </div>
        </Link>

        <Link to="/barang-keluar" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-orange-500/10 text-orange-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Barang Keluar</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Pengeluaran gudang</div>
          </div>
        </Link>

        <Link to="/laporan" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-purple-500/10 text-purple-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Laporan</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Rekapitulasi gudang</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
