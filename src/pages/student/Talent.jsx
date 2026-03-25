import React, { useState } from 'react';
import { Briefcase, Code, Video, UserPlus, Star, X, Check, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const StudentTalent = () => {
  const { user } = useAuth();
  const isStudent = user?.role === 'student';
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinedPosts, setJoinedPosts] = useState({});
  const [ratings, setRatings] = useState({});

  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Rohan Das",
      role: "Web Developer",
      looking_for: "Hackathon Team",
      skills: ["React", "Node.js", "MongoDB"],
      icon: <Code className="text-sky-600" />
    },
    {
      id: 2,
      name: "Sarah Smith",
      role: "Video Editor",
      looking_for: "Short Film Project",
      skills: ["Premiere Pro", "After Effects"],
      icon: <Video className="text-pink-600" />
    },
    {
      id: 3,
      name: "Amit Patel",
      role: "UI/UX Designer",
      looking_for: "App Developer for Project",
      skills: ["Figma", "Adobe XD"],
      icon: <Briefcase className="text-purple-600" />
    }
  ]);

  const [newPost, setNewPost] = useState({
    name: user?.username || '',
    role: '',
    looking_for: '',
    skills: ''
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const postToAdd = {
      ...newPost,
      id: Date.now(),
      skills: newPost.skills.split(',').map(s => s.trim()),
      icon: <Users className="text-sky-600" />
    };
    setPosts([postToAdd, ...posts]);
    setIsModalOpen(false);
    setNewPost({ name: user?.username || '', role: '', looking_for: '', skills: '' });
  };

  const toggleJoin = (postId) => {
    setJoinedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const handleRate = (postId, rating) => {
    setRatings(prev => ({
      ...prev,
      [postId]: rating
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Talent Exchange</h1>
        {isStudent && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <UserPlus size={16} /> Post Talent
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Post Your Talent</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handlePostSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Role</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Web Developer"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                  value={newPost.role}
                  onChange={(e) => setNewPost({...newPost, role: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Looking For</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Hackathon Team"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                  value={newPost.looking_for}
                  onChange={(e) => setNewPost({...newPost, looking_for: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. React, Node.js, Python"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-sky-500"
                  value={newPost.skills}
                  onChange={(e) => setNewPost({...newPost, skills: e.target.value})}
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold py-2.5 rounded-lg transition-colors shadow-md hover:shadow-lg"
              >
                Post Talent
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center">
                  {post.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{post.name}</h3>
                  <p className="text-xs text-slate-500">{post.role}</p>
                </div>
              </div>
              <span className="bg-sky-50 text-sky-700 text-xs px-2 py-1 rounded font-bold">Available</span>
            </div>
            
            <div className="mb-4">
              <p className="text-xs font-bold text-slate-400 uppercase mb-2">Looking For:</p>
              <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">{post.looking_for}</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.skills.map(skill => (
                <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                  {skill}
                </span>
              ))}
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => toggleJoin(post.id)}
                className={`w-full font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm ${
                  joinedPosts[post.id] 
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {joinedPosts[post.id] ? <><Check size={16}/> Joined</> : 'Join Talent'}
              </button>

              {joinedPosts[post.id] && (
                <div className="pt-3 border-t border-slate-100 animate-in slide-in-from-top-2 duration-200">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2 text-center">Rate this Talent</p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => handleRate(post.id, star)}
                        className={`${ratings[post.id] >= star ? 'text-amber-400' : 'text-slate-200'} hover:text-amber-300 transition-colors`}
                      >
                        <Star size={20} fill={ratings[post.id] >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentTalent;
