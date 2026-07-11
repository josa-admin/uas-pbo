import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function DashboardLayout() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f4f7f6] text-slate-800">
            {/* Sidebar (left) */}
            <Sidebar />

            {/* Main content wrapper (right) */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Navbar (top) */}
                <Navbar />

                {/* Page content view (bottom) */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
