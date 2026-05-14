'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Image, Users, Settings, Bell, BarChart3,
  Plus, Edit2, Trash2, Save, Upload, Zap, Link as LinkIcon,
  Gift, UserCheck, ClipboardList
} from 'lucide-react';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const sections = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'events', label: 'Events', icon: Calendar },
  { id: 'gallery', label: 'Gallery', icon: Image },
  { id: 'sponsors', label: 'Sponsors', icon: Users },
  { id: 'members', label: 'Join Requests', icon: UserCheck },
  { id: 'birthdays', label: 'Birthdays', icon: Gift },
  { id: 'announcements', label: 'Announcements', icon: Bell },
  { id: 'social', label: 'Social Links', icon: LinkIcon },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const stats = [
  { label: 'Total Events', value: '12', change: '+2', color: '#C21818' },
  { label: 'Gallery Items', value: '48', change: '+8', color: '#D4AF37' },
  { label: 'Active Members', value: '150+', change: '+12', color: '#D9FF00' },
  { label: 'Partners', value: '4', change: '+1', color: '#0B1F3A' },
];

const mockEvents = [
  { id: 1, title: 'Budget Badminton League', date: 'Dec 2023', type: 'Tournament', status: 'Past' },
  { id: 2, title: 'Weekend Smash Session', date: 'Every Saturday', type: 'Session', status: 'Active' },
  { id: 3, title: 'Mixed Doubles Night', date: 'Monthly', type: 'Community', status: 'Active' },
];

const mockGallery = [
  { id: 1, title: 'Budget Badminton League Finals', category: 'Tournaments', type: 'image' },
  { id: 2, title: 'Weekend Rally Session', category: 'Sessions', type: 'image' },
  { id: 3, title: 'Tournament Highlights Reel', category: 'Highlights', type: 'video' },
];

type JoinRow = { id: string; full_name: string; phone: string; skill_level: string; status: string; created_at: string; message?: string };
type BirthdayRow = { id: string; full_name: string; birthday_month: number; birthday_day: number; phone?: string; created_at: string };

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState('overview');
  const [announcement, setAnnouncement] = useState('');
  const [saved, setSaved] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRow[]>([]);
  const [birthdays, setBirthdays] = useState<BirthdayRow[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    if (activeSection === 'members') {
      setDataLoading(true);
      supabase.from('join_requests').select('*').order('created_at', { ascending: false })
        .then(({ data }) => { setJoinRequests(data ?? []); setDataLoading(false); });
    }
    if (activeSection === 'birthdays') {
      setDataLoading(true);
      supabase.from('birthday_submissions').select('*').order('birthday_month').order('birthday_day')
        .then(({ data }) => { setBirthdays(data ?? []); setDataLoading(false); });
    }
  }, [activeSection]);

  const updateJoinStatus = async (id: string, status: string) => {
    await supabase.from('join_requests').update({ status }).eq('id', id);
    setJoinRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#03050B] text-white flex overflow-hidden" style={{ paddingTop: 0 }}>
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-64 fixed left-0 top-0 bottom-0 bg-[#050810] border-r border-white/5 z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#C21818] to-[#D4AF37] flex items-center justify-center font-black text-xs">
              RCC
            </div>
            <div>
              <div className="text-white font-black text-sm">RCC Admin</div>
              <div className="text-[#D4AF37] text-[10px] tracking-widest">CONTROL PANEL</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-[#C21818]/20 to-transparent border border-[#C21818]/20 text-white'
                    : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={activeSection === section.id ? 'text-[#C21818]' : ''} />
                {section.label}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-2 text-white/30 text-xs">
            <div className="w-2 h-2 rounded-full bg-[#D9FF00] animate-pulse-glow" />
            Admin Session Active
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 min-h-screen">
        {/* Top Bar */}
        <div className="sticky top-0 z-40 bg-[#050810]/90 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <h1 className="text-xl font-black text-white capitalize">{activeSection}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white text-sm font-bold rounded-lg hover:shadow-[0_0_20px_rgba(194,24,24,0.4)] transition-all"
            >
              <Save size={14} />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* Overview */}
          {activeSection === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass rounded-2xl p-6">
                    <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-white/50 text-sm">{stat.label}</div>
                    <div className="text-[#D9FF00] text-xs font-bold mt-2">{stat.change} this month</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold mb-4">Recent Events</h3>
                  <div className="space-y-3">
                    {mockEvents.map((e) => (
                      <div key={e.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div>
                          <div className="text-white font-medium text-sm">{e.title}</div>
                          <div className="text-white/40 text-xs">{e.date}</div>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          e.status === 'Active' ? 'bg-[#D9FF00]/10 text-[#D9FF00]' : 'bg-white/10 text-white/40'
                        }`}>
                          {e.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="text-[#D4AF37] text-xs tracking-widest uppercase font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Add New Event', icon: Calendar, action: () => setActiveSection('events') },
                      { label: 'Upload Gallery Media', icon: Image, action: () => setActiveSection('gallery') },
                      { label: 'Post Announcement', icon: Bell, action: () => setActiveSection('announcements') },
                      { label: 'Add Sponsor', icon: Users, action: () => setActiveSection('sponsors') },
                    ].map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={action.action}
                          className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm text-white/70 hover:text-white transition-all group"
                        >
                          <Icon size={16} className="text-[#C21818] group-hover:scale-110 transition-transform" />
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Events Manager */}
          {activeSection === 'events' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-sm">Manage RCC events, sessions, and tournaments.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] text-sm font-bold rounded-lg">
                  <Plus size={14} />
                  Add Event
                </button>
              </div>

              <div className="glass rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Event</th>
                      <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Date</th>
                      <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Type</th>
                      <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Status</th>
                      <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mockEvents.map((event) => (
                      <tr key={event.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-white font-medium">{event.title}</td>
                        <td className="p-4 text-white/50 text-sm">{event.date}</td>
                        <td className="p-4 text-white/50 text-sm">{event.type}</td>
                        <td className="p-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                            event.status === 'Active' ? 'bg-[#D9FF00]/10 text-[#D9FF00]' : 'bg-white/10 text-white/40'
                          }`}>
                            {event.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 hover:bg-[#D4AF37]/20 rounded-lg text-white/40 hover:text-[#D4AF37] transition-all">
                              <Edit2 size={14} />
                            </button>
                            <button className="p-1.5 hover:bg-[#C21818]/20 rounded-lg text-white/40 hover:text-[#C21818] transition-all">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Event Form */}
              <div className="glass rounded-2xl p-6">
                <h3 className="text-[#D4AF37] text-sm font-black tracking-widest uppercase mb-6">Add New Event</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Event Title', placeholder: 'e.g. Budget Badminton League' },
                    { label: 'Venue', placeholder: 'e.g. Siri Fort Sports Complex' },
                    { label: 'Date', placeholder: 'e.g. December 15, 2025' },
                    { label: 'Time', placeholder: 'e.g. 7:00 AM – 10:00 AM' },
                    { label: 'Skill Level', placeholder: 'e.g. All Levels / Intermediate' },
                    { label: 'Total Slots', placeholder: 'e.g. 16' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">{field.label}</label>
                      <input
                        type="text"
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Description</label>
                    <textarea
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors resize-none"
                      placeholder="Event description..."
                    />
                  </div>
                </div>
                <button className="mt-4 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white text-sm font-bold rounded-lg">
                  <Save size={14} />
                  Save Event
                </button>
              </div>
            </motion.div>
          )}

          {/* Gallery Manager */}
          {activeSection === 'gallery' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-sm">Manage gallery images and videos.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] text-sm font-bold rounded-lg">
                  <Upload size={14} />
                  Upload Media
                </button>
              </div>

              {/* Upload Zone */}
              <div className="glass rounded-2xl p-8 border-2 border-dashed border-white/10 text-center hover:border-[#D4AF37]/30 transition-colors cursor-pointer group">
                <Upload size={40} className="mx-auto text-white/20 group-hover:text-[#D4AF37] transition-colors mb-4" />
                <p className="text-white/50 mb-2">Drag & drop images or videos here</p>
                <p className="text-white/30 text-sm">Supports JPG, PNG, MP4, MOV up to 100MB</p>
                <button className="mt-4 px-5 py-2 glass rounded-lg text-white/60 text-sm hover:text-white transition-colors">
                  Browse Files
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {mockGallery.map((item) => (
                  <div key={item.id} className="glass rounded-xl overflow-hidden group relative aspect-square">
                    <div className="absolute inset-0 flex items-center justify-center text-4xl">
                      {item.type === 'video' ? '🎬' : '📸'}
                    </div>
                    <div className="absolute inset-0 bg-[#050810]/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      <p className="text-white text-xs font-bold text-center px-2">{item.title}</p>
                      <div className="flex gap-2">
                        <button className="p-1.5 bg-[#D4AF37]/20 rounded-lg text-[#D4AF37]">
                          <Edit2 size={12} />
                        </button>
                        <button className="p-1.5 bg-[#C21818]/20 rounded-lg text-[#C21818]">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Join Requests */}
          {activeSection === 'members' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-sm">Review and approve join requests from new members.</p>
                <span className="text-xs px-3 py-1.5 rounded-full bg-[#D9FF00]/10 text-[#D9FF00] font-bold">
                  {joinRequests.filter(r => r.status === 'pending').length} pending
                </span>
              </div>

              {dataLoading ? (
                <div className="text-center py-16 text-white/30">Loading...</div>
              ) : joinRequests.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-white/40">No join requests yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {joinRequests.map(req => (
                    <div key={req.id} className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-white font-black">{req.full_name}</span>
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            req.status === 'approved' ? 'bg-[#D9FF00]/10 text-[#D9FF00]' :
                            req.status === 'rejected' ? 'bg-[#C21818]/20 text-[#C21818]' :
                            'bg-[#D4AF37]/10 text-[#D4AF37]'
                          }`}>
                            {req.status}
                          </span>
                          <span className="text-white/30 text-xs">{req.skill_level}</span>
                        </div>
                        <div className="text-white/50 text-sm">{req.phone}</div>
                        {req.message && <div className="text-white/30 text-xs mt-1 italic">"{req.message}"</div>}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => updateJoinStatus(req.id, 'approved')}
                          className="px-3 py-1.5 bg-[#D9FF00]/10 hover:bg-[#D9FF00]/20 text-[#D9FF00] text-xs font-bold rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateJoinStatus(req.id, 'rejected')}
                          className="px-3 py-1.5 bg-[#C21818]/10 hover:bg-[#C21818]/20 text-[#C21818] text-xs font-bold rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Birthdays Manager */}
          {activeSection === 'birthdays' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <p className="text-white/50 text-sm">All member birthday submissions.</p>

              {dataLoading ? (
                <div className="text-center py-16 text-white/30">Loading...</div>
              ) : birthdays.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                  <div className="text-4xl mb-3">🎂</div>
                  <p className="text-white/40">No birthdays submitted yet.</p>
                </div>
              ) : (
                <div className="glass rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Name</th>
                        <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Birthday</th>
                        <th className="text-left p-4 text-white/40 text-xs tracking-widest uppercase">Phone</th>
                        <th className="text-left p-4 text-white/40 text-xs tracking-widests uppercase">Added</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {birthdays.map(b => (
                        <tr key={b.id} className="hover:bg-white/3 transition-colors">
                          <td className="p-4 text-white font-medium">{b.full_name}</td>
                          <td className="p-4 text-[#D4AF37] font-bold text-sm">
                            {MONTHS[b.birthday_month - 1]} {b.birthday_day}
                          </td>
                          <td className="p-4 text-white/40 text-sm">{b.phone ?? '—'}</td>
                          <td className="p-4 text-white/30 text-xs">
                            {new Date(b.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* Announcements */}
          {activeSection === 'announcements' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-[#D4AF37] text-sm font-black tracking-widest uppercase mb-6">Post Announcement</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Title</label>
                    <input
                      type="text"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors"
                      placeholder="Announcement title..."
                    />
                  </div>
                  <div>
                    <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">Message</label>
                    <textarea
                      rows={5}
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors resize-none"
                      placeholder="Your announcement..."
                    />
                  </div>
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white text-sm font-bold rounded-lg">
                    <Zap size={14} />
                    Post Announcement
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Social Links */}
          {activeSection === 'social' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-[#D4AF37] text-sm font-black tracking-widest uppercase mb-6">Update Social Links</h3>
                <div className="space-y-4">
                  {[
                    { label: 'WhatsApp Community Link', default: 'https://chat.whatsapp.com/KeznsK95pHK1JKT4nqpcsv' },
                    { label: 'Instagram Profile URL', default: 'https://www.instagram.com/racquetsclubcommunity' },
                    { label: 'Facebook Page URL', default: 'https://www.facebook.com/share/1CP9eke83b/' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">{field.label}</label>
                      <input
                        type="url"
                        defaultValue={field.default}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors"
                      />
                    </div>
                  ))}
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white text-sm font-bold rounded-lg">
                    <Save size={14} />
                    Update Links
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Sponsors */}
          {activeSection === 'sponsors' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-white/50 text-sm">Manage sponsor logos and information.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8960C] text-[#050810] text-sm font-bold rounded-lg">
                  <Plus size={14} />
                  Add Sponsor
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Racquets Club Community', 'SUM India', 'Soul Stretch', 'Portronics'].map((sponsor) => (
                  <div key={sponsor} className="glass rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold">{sponsor}</div>
                      <div className="text-white/40 text-xs mt-1">Partner</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-[#D4AF37]/20 rounded-lg text-white/40 hover:text-[#D4AF37] transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-2 hover:bg-[#C21818]/20 rounded-lg text-white/40 hover:text-[#C21818] transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings */}
          {activeSection === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="glass rounded-2xl p-6">
                <h3 className="text-[#D4AF37] text-sm font-black tracking-widest uppercase mb-6">Site Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Site Title', default: 'Racquets Club Community (RCC)' },
                    { label: 'Tagline', default: "Delhi's Invite-Only Badminton Community" },
                    { label: 'Total Active Players', default: '150' },
                    { label: 'Total Events Hosted', default: '50' },
                    { label: 'Weekend Sessions', default: '200' },
                    { label: 'Community Partners', default: '10' },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-2">{field.label}</label>
                      <input
                        type="text"
                        defaultValue={field.default}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50 text-sm transition-colors"
                      />
                    </div>
                  ))}
                  <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white text-sm font-bold rounded-lg">
                    <Save size={14} />
                    Save Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
