import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";

interface Comment {
  id: number;
  ticketId: number;
  userId: number;
  comment: string;
  createdAt: string;
}

interface TicketDetails {
  ticket: {
    id: number;
    subject: string;
    description: string;
    status: string;
    priority: string;
    userId: number;
    assignedToId: number | null;
    createdAt: string;
    updatedAt: string;
  };
  comments: Comment[];
}

export default function TicketDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedPriority, setSelectedPriority] = useState<string>("");
  
  // Fetch ticket details
  const { data, isLoading, error } = useQuery<TicketDetails>({
    queryKey: [`/api/tickets/${id}`],
    enabled: !!id && !!user,
  });
  
  // Update status and priority on load
  useEffect(() => {
    if (data?.ticket) {
      setSelectedStatus(data.ticket.status);
      setSelectedPriority(data.ticket.priority);
    }
  }, [data]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: async (comment: string) => {
      const response = await apiRequest('POST', `/api/tickets/${id}/comments`, { comment });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${id}`] });
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been added to the ticket.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  // Update ticket mutation
  const updateTicketMutation = useMutation({
    mutationFn: async (updateData: { status?: string; priority?: string }) => {
      const response = await apiRequest('PATCH', `/api/tickets/${id}`, updateData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tickets/${id}`] });
      toast({
        title: "Ticket updated",
        description: "The ticket has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update ticket",
        variant: "destructive",
      });
    },
  });

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value);
    updateTicketMutation.mutate({ status: value });
  };

  const handlePriorityChange = (value: string) => {
    setSelectedPriority(value);
    updateTicketMutation.mutate({ priority: value });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment);
    }
  };

  const handleBack = () => {
    // Navigate back based on user role
    if (user?.role === 'admin') {
      navigate('/admin-dashboard');
    } else if (user?.role === 'employee') {
      navigate('/employee-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPpp");
  };

  // Get badge class for status
  const getStatusBadgeClass = (status: string) => {
    return `badge-status-${status}`;
  };

  // Get badge class for priority
  const getPriorityBadgeClass = (priority: string) => {
    return `badge-priority-${priority}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Error Loading Ticket</h2>
              <p className="text-muted-foreground mb-4">
                {error instanceof Error ? error.message : "Failed to load ticket details"}
              </p>
              <Button onClick={handleBack}>Go Back</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { ticket, comments } = data;
  const isEmployee = user?.role === 'employee' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          className="mb-6" 
          onClick={handleBack}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Ticket #{ticket.id}: {ticket.subject}</CardTitle>
                <CardDescription>
                  Created {formatDate(ticket.createdAt)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {isEmployee ? (
                  <>
                    <Select value={selectedStatus} onValueChange={handleStatusChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={selectedPriority} onValueChange={handlePriorityChange}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <>
                    <Badge className={getStatusBadgeClass(ticket.status)}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityBadgeClass(ticket.priority)}>
                      {ticket.priority}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-md whitespace-pre-wrap">
              {ticket.description}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No comments yet</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold mr-2">
                          {comment.userId === user?.id ? 'You' : 'A'}
                        </div>
                        <span className="font-medium">
                          {comment.userId === user?.id ? 'You' : 
                           comment.userId === ticket.userId ? 'Customer' : 'Staff'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <div className="ml-10 whitespace-pre-wrap">
                      {comment.comment}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="p-4 flex flex-col">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[100px] mb-4"
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleAddComment} 
                disabled={!newComment.trim() || addCommentMutation.isPending}
              >
                {addCommentMutation.isPending ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
