import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface RepositoryFormProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const RepositoryForm: React.FC<RepositoryFormProps> = ({
  repoUrl,
  setRepoUrl,
  loading,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="flex gap-4 glass-card p-4 rounded-lg">
      <Input
        type="text"
        placeholder="https://github.com/username/repo"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        className="bg-github-darker/50 border-white/10"
      />
      <Button
        type="submit"
        disabled={loading}
        className="relative px-6 py-2.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg text-white"
      >
        {loading ? "Loading..." : "Visualize"}
      </Button>
    </form>
  );
};

export default RepositoryForm;