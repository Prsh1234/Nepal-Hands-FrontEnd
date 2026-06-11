import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Ban } from "lucide-react";
import { recentUsers, statusBadgeConfig } from "@/data/admin";

const statusBadge = (status: string) => {
  const c = statusBadgeConfig[status] || statusBadgeConfig.pending;
  return <Badge variant={c.variant}>{c.label}</Badge>;
};

const AdminUsers = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-2xl font-bold font-heading text-foreground">User Management</h1>
      <p className="text-muted-foreground text-sm mt-1">View and manage platform users.</p>
    </div>
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Users</CardTitle>
        <CardDescription>Latest sign-ups across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Campaigns</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentUsers.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium">{u.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">{u.email}</TableCell>
                <TableCell><Badge variant="outline">{u.role}</Badge></TableCell>
                <TableCell>{u.campaigns}</TableCell>
                <TableCell>{u.joined}</TableCell>
                <TableCell>{statusBadge(u.status)}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="ghost"><Eye className="h-4 w-4" /></Button>
                  <Button size="sm" variant="outline"><Ban className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
);

export default AdminUsers;