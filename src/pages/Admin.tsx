import { useEffect, useState } from "react";
import { Shield, Users, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAllProfiles, updateUserRole } from "@/db/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import type { Profile } from "@/types";
import { Navigate } from "react-router-dom";

export default function Admin() {
  const { profile: currentProfile, loading: authLoading } = useAuth();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    loadProfiles();
  }, []);

  async function loadProfiles() {
    try {
      const data = await getAllProfiles();
      setProfiles(data);
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleRoleChange(userId: string, newRole: 'user' | 'admin') {
    setUpdating(userId);
    try {
      await updateUserRole(userId, newRole);
      setProfiles(profiles.map(p => p.id === userId ? { ...p, role: newRole } : p));
      toast.success("User role updated successfully");
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdating(null);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (currentProfile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-background via-muted to-background">
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-soft">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold gradient-text">Admin Panel</h1>
          </div>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>

        <Card className="shadow-soft-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>View and manage user roles</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profiles.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              ) : (
                profiles.map((profile) => (
                  <div
                    key={profile.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-smooth"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                          <span className="text-primary-foreground font-semibold">
                            {profile.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{profile.username}</p>
                          <p className="text-sm text-muted-foreground">
                            Joined {new Date(profile.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <Select
                        value={profile.role}
                        onValueChange={(value) => handleRoleChange(profile.id, value as 'user' | 'admin')}
                        disabled={updating === profile.id || profile.id === currentProfile?.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="user">User</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>

                      {updating === profile.id && (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      )} 

                      {profile.id === currentProfile?.id && (
                        <span className="text-xs text-muted-foreground">(You)</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 rounded-lg bg-muted/50 border">
          <h3 className="font-semibold mb-2">Admin Notes:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• The first registered user automatically becomes an admin</li>
            <li>• You cannot change your own role</li>
            <li>• Admins have full access to all features and user management</li>
            <li>• Regular users can only access their own data</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
