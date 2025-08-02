"use client"

import { CardDescription } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bell, CheckCircle, XCircle, Info, Mail, Calendar, UserCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Notification {
  id: number
  type: "info" | "alert" | "success" | "interview" | "feedback" | "offer"
  message: string
  timestamp: string
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: "interview",
      message: "Interview with Sarah Johnson for Frontend Dev in 15 minutes.",
      timestamp: "2 min ago",
      read: false,
      action: { label: "Join Call", onClick: () => alert("Joining call...") },
    },
    {
      id: 2,
      type: "feedback",
      message: "Feedback for Michael Chen (Product Manager) is overdue.",
      timestamp: "1 hour ago",
      read: false,
      action: { label: "Submit Feedback", onClick: () => alert("Opening feedback form...") },
    },
    {
      id: 3,
      type: "offer",
      message: "Offer for Emily Rodriguez (UX Designer) expires today!",
      timestamp: "3 hours ago",
      read: false,
      action: { label: "Follow Up", onClick: () => alert("Following up on offer...") },
    },
    {
      id: 4,
      type: "success",
      message: "New job posting 'Senior Backend Engineer' published successfully.",
      timestamp: "Yesterday",
      read: true,
    },
    {
      id: 5,
      type: "alert",
      message: "High volume of applications for 'DevOps Engineer'. Review needed.",
      timestamp: "2 days ago",
      read: true,
    },
    {
      id: 6,
      type: "info",
      message: "System update scheduled for tonight at 2 AM PST.",
      timestamp: "3 days ago",
      read: true,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "alert":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "interview":
        return <Calendar className="h-5 w-5 text-purple-500" />
      case "feedback":
        return <Mail className="h-5 w-5 text-orange-500" />
      case "offer":
        return <UserCheck className="h-5 w-5 text-emerald-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getBadgeColor = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-700"
      case "alert":
        return "bg-red-100 text-red-700"
      case "success":
        return "bg-green-100 text-green-700"
      case "interview":
        return "bg-purple-100 text-purple-700"
      case "feedback":
        return "bg-orange-100 text-orange-700"
      case "offer":
        return "bg-emerald-100 text-emerald-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated on important activities and alerts.</p>
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead} className="bg-transparent">
            Mark All as Read
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Your Recent Notifications</CardTitle>
          <CardDescription>
            You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No new notifications.</div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border ${
                    !notification.read ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className={`text-sm ${!notification.read ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getBadgeColor(notification.type)}`}>
                        {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex space-x-2">
                    {!notification.read && (
                      <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                        Mark as Read
                      </Button>
                    )}
                    {notification.action && (
                      <Button size="sm" onClick={notification.action.onClick}>
                        {notification.action.label}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
