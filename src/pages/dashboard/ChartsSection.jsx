import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";
import { useTranslation } from "react-i18next";
import { FormatNumber } from "../../utils/FormatNumber";
import ExcelExportButton from "../../utils/ExcelExportButton";

const COLORS = ["#E52020", "#F0F0F0"];

const ChartsSection = ({ percentUserIncrease, users, monthlyIncomes, totalIncomes }) => {
    const { t } = useTranslation("dashboard");

    const dataCircle = [
        { name: "Increase", value: percentUserIncrease },
        { name: "Rest", value: 100 - percentUserIncrease },
    ];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">

            {/* Pie Chart */}
            <div className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center">
                <h2 className="text-lg font-medium mb-2 text-center">{t("all_users")}</h2>
                <div className="w-40 h-40">
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={dataCircle}
                                dataKey="value"
                                innerRadius={40}
                                outerRadius={60}
                                paddingAngle={5}
                            >
                                {dataCircle.map((entry, idx) => (
                                    <Cell key={idx} fill={COLORS[idx]} />
                                ))}
                            </Pie>
                            <text
                                x="50%"
                                y="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontWeight="bold"
                                fill="black"
                            >
                                {Math.round(percentUserIncrease)}%
                            </text>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-red-600 mt-2 text-center">
                    {t("monthly_user", { count: users.length })} {percentUserIncrease}%
                </p>
            </div>

            {/* Area Chart */}
            <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-medium">{t("income")}</h2>
                    <ExcelExportButton data={monthlyIncomes} fileName="FixRevenueReport.xlsx" />
                </div>
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={monthlyIncomes}
                            margin={{ top: 10, right: 10, left: 60, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E52020" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="#E52020" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" />
                            <YAxis
                                tickFormatter={FormatNumber}
                                tick={{ fontSize: 11 }}
                                width={80}
                            />
                            <Tooltip
                                formatter={(value) => FormatNumber(value)}
                                contentStyle={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #E52020",
                                    borderRadius: 8,
                                    fontSize: 12,
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#E52020"
                                fill="url(#colorValue)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-2 text-right text-green-500 font-semibold">
                    {t("total_income")} : {FormatNumber(totalIncomes)} {t("currency")}
                </div>
            </div>
        </div>
    );
};

export default ChartsSection;