"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    handle: "",
    password: "",
    name: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (res.ok) {
        toast({ title: isLogin ? "Welcome back!" : "Account created!" });
        router.push("/");
        router.refresh();
      } else {
        toast({ title: "Error", description: data.error, variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Error", description: "Something went wrong", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-muted/5 font-sans">
      <Link href="/" className="absolute top-8 left-8">
        <Button variant="ghost" size="sm" className="gap-2 rounded-full">
          <ArrowLeft className="w-4 h-4" />
          Back to workbench
        </Button>
      </Link>

      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20">
            <Zap className="w-6 h-6 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Split Premium</h1>
          <p className="text-muted-foreground text-sm max-w-[280px]">
            {isLogin ? "Sign in to access your saved diffs and discussions." : "Create an account to start sharing and collaborating."}
          </p>
        </div>

        <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-xl glass-card rounded-3xl overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex bg-muted/30 p-1 rounded-full border border-white/5">
              <Button 
                variant="ghost" 
                className={`flex-1 rounded-full text-xs font-bold uppercase tracking-widest ${isLogin ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsLogin(true)}
              >
                Login
              </Button>
              <Button 
                variant="ghost" 
                className={`flex-1 rounded-full text-xs font-bold uppercase tracking-widest ${!isLogin ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground'}`}
                onClick={() => setIsLogin(false)}
              >
                Sign Up
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Handle</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-muted-foreground text-sm opacity-50">@</span>
                  <Input 
                    className="pl-8 bg-muted/20 border-white/5 rounded-xl h-11 transition-all focus:ring-2 focus:ring-primary/20"
                    placeholder="username"
                    value={formData.handle}
                    onChange={e => setFormData({ ...formData, handle: e.target.value })}
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Display Name</label>
                  <Input 
                    className="bg-muted/20 border-white/5 rounded-xl h-11 transition-all focus:ring-2 focus:ring-primary/20"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-1">Password</label>
                <Input 
                  type="password"
                  className="bg-muted/20 border-white/5 rounded-xl h-11 transition-all focus:ring-2 focus:ring-primary/20"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest shadow-xl shadow-primary/10 mt-4"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isLogin ? "Enter Workbench" : "Create Account")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
