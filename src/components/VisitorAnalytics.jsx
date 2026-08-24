"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"
import { useLanguage } from "../contexts/LanguageContext"
import { useToastContext } from "./AdminConsole"
import { Loader2, Users, Eye, CalendarDays } from "lucide-react"

const VisitorAnalytics = () => {
  const [loading, setLoading] = useState(false)
  const [analytics, setAnalytics] = useState({
    totalUniqueVisitors: 0,
    totalVisits: 0,
    lastVisitAt: null,
    daily: [],
  })

  const navigate = useNavigate()
  const { language, t } = useLanguage()
  const { showError } = useToastContext()
  const isKorean = language === "ko-KR"

  const fetchVisitorAnalytics = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/login")
        return
      }

      const response = await fetch(`${API_URL}/api/analytics/visitors`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setAnalytics({
          totalUniqueVisitors: data?.totalUniqueVisitors || 0,
          totalVisits: data?.totalVisits || 0,
          lastVisitAt: data?.lastVisitAt || null,
          daily: Array.isArray(data?.daily) ? data.daily : [],
        })
      } else {
        if (response.status === 401) {
          localStorage.removeItem("token")
          navigate("/login")
        } else {
          const data = await response.json().catch(() => ({}))
          showError(data.error || (isKorean ? t("admin.error") : "Failed to load visitor analytics"))
        }
      }
    } catch (error) {
      console.error("Error fetching visitor analytics:", error)
      showError(isKorean ? t("admin.networkError") : "Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitorAnalytics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  const formatDate = (dateValue) => {
    if (!dateValue) return "-"
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return "-"
    return date.toLocaleString(language === "ko-KR" ? "ko-KR" : "en-CA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          {isKorean ? "방문자 통계" : "Visitor Analytics"}
        </h2>
        <button
          onClick={fetchVisitorAnalytics}
          disabled={loading}
          className={`border border-black px-3 py-1 rounded-md hover:bg-gray-100 transition-colors duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? (isKorean ? "불러오는 중..." : "Refreshing...") : (isKorean ? "새로고침" : "Refresh")}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-sm">{isKorean ? "총 방문자(고유)" : "Total Unique Visitors"}</span>
          </div>
          <p className="text-2xl font-semibold">{analytics.totalUniqueVisitors.toLocaleString()}</p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <Eye className="w-4 h-4" />
            <span className="text-sm">{isKorean ? "총 방문 수" : "Total Visits"}</span>
          </div>
          <p className="text-2xl font-semibold">{analytics.totalVisits.toLocaleString()}</p>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg bg-white">
          <div className="flex items-center gap-2 text-gray-600 mb-1">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm">{isKorean ? "최근 방문" : "Last Visit"}</span>
          </div>
          <p className="text-sm font-medium">{formatDate(analytics.lastVisitAt)}</p>
        </div>
      </div>

      {/* Daily table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 font-semibold">
          {isKorean ? "최근 30일 일별 통계" : "Daily Stats (Last 30 Days)"}
        </div>

        {loading ? (
          <div className="p-6 flex items-center justify-center text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            {isKorean ? "불러오는 중..." : "Loading..."}
          </div>
        ) : analytics.daily.length === 0 ? (
          <div className="p-6 text-gray-500 text-sm">
            {isKorean ? "표시할 데이터가 없습니다." : "No data available yet."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-2 font-medium">{isKorean ? "날짜" : "Date"}</th>
                  <th className="px-4 py-2 font-medium">{isKorean ? "방문 수" : "Visits"}</th>
                  <th className="px-4 py-2 font-medium">{isKorean ? "고유 방문자" : "Unique Visitors"}</th>
                </tr>
              </thead>
              <tbody>
                {analytics.daily.map((day) => (
                  <tr key={day.id || day.date} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-4 py-2">{day.date || "-"}</td>
                    <td className="px-4 py-2">{(day.visits || 0).toLocaleString()}</td>
                    <td className="px-4 py-2">{(day.uniqueVisitors || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default VisitorAnalytics