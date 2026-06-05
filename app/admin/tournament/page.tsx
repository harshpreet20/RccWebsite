'use client';

import { useState, useCallback } from 'react';
import { ChevronDown, Plus, Trash2, Save, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────

interface Partner {
  id: string;
  name: string;
  fee: number;
  pairsPerPartner: number;
  confirmedPlayers: number;
}

interface OneTimeCost {
  id: string;
  label: string;
  amount: number;
  deletable: boolean;
}

interface PerDayCost {
  id: string;
  label: string;
  amount: number;
}

interface TournamentState {
  eventName: string;
  eventDays: number;
  targetEarnings: number;
  brandPartners: Partner[];
  communityPartners: Partner[];
  playerFee: number;
  sponsorship: {
    paidSponsor: { enabled: boolean; name: string; amount: number };
    barterShuttle: { enabled: boolean; name: string; value: number };
  };
  vendorStalls: { count: number; feePerStall: number };
  sundowner: {
    enabled: boolean;
    generalTicketPrice: number;
    generalAttendees: number;
    vipEnabled: boolean;
    vipTicketPrice: number;
    vipAttendees: number;
  };
  costs: {
    oneTime: OneTimeCost[];
    perDay: PerDayCost[];
    contingencyPct: number;
  };
}

interface Metrics {
  brandPartnerRevenue: number;
  communityPartnerRevenue: number;
  playerFeeRevenue: number;
  registrationFeeRevenue: number;
  paidSponsorRevenue: number;
  barterValue: number;
  vendorRevenue: number;
  sundownerRevenue: number;
  totalRevenue: number;
  perDayCostSubtotal: number;
  oneTimeCostSubtotal: number;
  preContingencyTotal: number;
  contingencyAmount: number;
  totalCosts: number;
  grossSurplus: number;
  prizePoolAmount: number;
  mgmtFee: number;
  rrcEarnings: number;
  totalPlayers: number;
}

// ── Initial State ──────────────────────────────────────────────────────────

function newId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

const initialState: TournamentState = {
  eventName: 'RRC Doubles Cup - Season 1',
  eventDays: 2,
  targetEarnings: 150000,
  brandPartners: [{ id: '1', name: 'Brand Partner 1', fee: 150000, pairsPerPartner: 3, confirmedPlayers: 6 }],
  communityPartners: [{ id: '2', name: 'Community Partner 1', fee: 40000, pairsPerPartner: 1, confirmedPlayers: 2 }],
  playerFee: 1000,
  sponsorship: {
    paidSponsor: { enabled: false, name: '', amount: 0 },
    barterShuttle: { enabled: false, name: '', value: 0 },
  },
  vendorStalls: { count: 0, feePerStall: 5000 },
  sundowner: {
    enabled: false,
    generalTicketPrice: 500,
    generalAttendees: 50,
    vipEnabled: false,
    vipTicketPrice: 1500,
    vipAttendees: 10,
  },
  costs: {
    oneTime: [
      { id: 'printables', label: 'Printables & Branding', amount: 15000, deletable: true },
      { id: 'prizes', label: 'Prize Pool', amount: 45000, deletable: false },
      { id: 'mgmtFee', label: 'Management Fee', amount: 50000, deletable: false },
    ],
    perDay: [
      { id: 'courts', label: 'Court Booking', amount: 20000 },
      { id: 'catering', label: 'Catering', amount: 15000 },
      { id: 'photography', label: 'Photography', amount: 8000 },
    ],
    contingencyPct: 8,
  },
};

// ── Compute Metrics ────────────────────────────────────────────────────────

function computeMetrics(state: TournamentState): Metrics {
  const brandPartnerRevenue = state.brandPartners.reduce((s, p) => s + p.fee, 0);
  const communityPartnerRevenue = state.communityPartners.reduce((s, p) => s + p.fee, 0);
  const totalPlayers =
    state.brandPartners.reduce((s, p) => s + p.confirmedPlayers, 0) +
    state.communityPartners.reduce((s, p) => s + p.confirmedPlayers, 0);
  const playerFeeRevenue = totalPlayers * Math.min(state.playerFee, 1000);
  const registrationFeeRevenue = (state.brandPartners.length + state.communityPartners.length) * 5000;
  const paidSponsorRevenue = state.sponsorship.paidSponsor.enabled ? state.sponsorship.paidSponsor.amount : 0;
  const barterValue = state.sponsorship.barterShuttle.enabled ? state.sponsorship.barterShuttle.value : 0;
  const vendorRevenue = state.vendorStalls.count * state.vendorStalls.feePerStall;
  const sd = state.sundowner;
  const sundownerRevenue = sd.enabled
    ? sd.generalTicketPrice * sd.generalAttendees + (sd.vipEnabled ? sd.vipTicketPrice * sd.vipAttendees : 0)
    : 0;

  const totalRevenue =
    brandPartnerRevenue +
    communityPartnerRevenue +
    playerFeeRevenue +
    registrationFeeRevenue +
    paidSponsorRevenue +
    barterValue +
    vendorRevenue +
    sundownerRevenue;

  const perDayCostSubtotal = state.costs.perDay.reduce((s, c) => s + c.amount, 0) * state.eventDays;
  const oneTimeCostSubtotal = state.costs.oneTime.reduce((s, c) => s + c.amount, 0);
  const preContingencyTotal = perDayCostSubtotal + oneTimeCostSubtotal;
  const contingencyAmount = preContingencyTotal * (state.costs.contingencyPct / 100);
  const totalCosts = preContingencyTotal + contingencyAmount;
  const grossSurplus = totalRevenue - totalCosts;

  const prizeItem = state.costs.oneTime.find((c) => c.id === 'prizes');
  const mgmtItem = state.costs.oneTime.find((c) => c.id === 'mgmtFee');
  const prizePoolAmount = prizeItem ? prizeItem.amount : 45000;
  const mgmtFee = mgmtItem ? mgmtItem.amount : 50000;
  const rrcEarnings = mgmtFee + grossSurplus;

  return {
    brandPartnerRevenue,
    communityPartnerRevenue,
    playerFeeRevenue,
    registrationFeeRevenue,
    paidSponsorRevenue,
    barterValue,
    vendorRevenue,
    sundownerRevenue,
    totalRevenue,
    perDayCostSubtotal,
    oneTimeCostSubtotal,
    preContingencyTotal,
    contingencyAmount,
    totalCosts,
    grossSurplus,
    prizePoolAmount,
    mgmtFee,
    rrcEarnings,
    totalPlayers,
  };
}

// ── Formatters ─────────────────────────────────────────────────────────────

function formatINR(n: number): string {
  if (isNaN(n)) return '₹0';
  const abs = Math.abs(Math.round(n));
  const str = abs.toString();
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.slice(-3);
    const rest = str.slice(0, -3);
    const groups = [];
    for (let i = rest.length; i > 0; i -= 2) {
      groups.unshift(rest.slice(Math.max(0, i - 2), i));
    }
    result = groups.join(',') + ',' + last3;
  }
  return (n < 0 ? '-₹' : '₹') + result;
}

// ── Subcomponents ──────────────────────────────────────────────────────────

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 mb-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between text-left group"
      >
        <span className="text-white/60 text-xs tracking-widest uppercase font-bold">{title}</span>
        <ChevronDown
          size={16}
          className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-white/60 text-xs tracking-widest uppercase mb-1.5">{children}</label>;
}

function Input({
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none w-full"
    />
  );
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${
        on ? 'bg-[#C21818]' : 'bg-white/10'
      }`}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all duration-200 ${
          on ? 'left-5' : 'left-0.5'
        }`}
      />
    </button>
  );
}

function PartnerCard({
  partner,
  onChange,
  onDelete,
  canDelete = true,
}: {
  partner: Partner;
  onChange: (p: Partner) => void;
  onDelete: () => void;
  canDelete?: boolean;
}) {
  const totalPairs = partner.pairsPerPartner;
  const maxPlayers = totalPairs * 2;
  return (
    <div className="bg-[#0F1520] border border-white/10 rounded-xl p-4 mb-3">
      <div className="flex items-center gap-2 mb-3">
        <input
          type="text"
          value={partner.name}
          onChange={(e) => onChange({ ...partner, name: e.target.value })}
          className="bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none flex-1"
          placeholder="Partner name"
        />
        {canDelete && (
          <button
            onClick={onDelete}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-[#C21818] hover:border-[#C21818]/40 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Partnership Fee</Label>
          <Input
            type="number"
            value={partner.fee}
            onChange={(v) => onChange({ ...partner, fee: Number(v) })}
          />
        </div>
        <div>
          <Label>Pairs Allocated</Label>
          <Input
            type="number"
            value={partner.pairsPerPartner}
            onChange={(v) => onChange({ ...partner, pairsPerPartner: Number(v), confirmedPlayers: Math.min(partner.confirmedPlayers, Number(v) * 2) })}
          />
        </div>
      </div>
      <div className="mt-3">
        <Label>Confirmed Players (max {maxPlayers})</Label>
        <Input
          type="number"
          value={partner.confirmedPlayers}
          onChange={(v) => onChange({ ...partner, confirmedPlayers: Math.min(Number(v), maxPlayers) })}
        />
      </div>
      <div className="mt-2 text-white/30 text-xs">
        {partner.pairsPerPartner} pair{partner.pairsPerPartner !== 1 ? 's' : ''} · {partner.confirmedPlayers}/{maxPlayers} players confirmed
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  gradient,
  sub,
}: {
  label: string;
  value: string;
  gradient?: string;
  sub?: string;
}) {
  return (
    <div className={`rounded-xl p-5 ${gradient ?? 'bg-[#0A0E1A] border border-white/10'}`}>
      <div className="text-white/60 text-xs tracking-widest uppercase mb-1">{label}</div>
      <div className="text-white font-black text-3xl">{value}</div>
      {sub && <div className="text-white/50 text-xs mt-1">{sub}</div>}
    </div>
  );
}

function TableRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <tr className={highlight ? 'bg-white/5' : ''}>
      <td className={`py-2 px-3 text-sm ${highlight ? 'text-white font-bold' : 'text-white/60'}`}>{label}</td>
      <td className={`py-2 px-3 text-sm text-right ${highlight ? 'text-white font-bold' : 'text-white/70'}`}>{value}</td>
    </tr>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────

export default function TournamentPage() {
  const [state, setState] = useState<TournamentState>(initialState);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const metrics = computeMetrics(state);

  const updateBrandPartner = useCallback((id: string, updated: Partner) => {
    setState((s) => ({ ...s, brandPartners: s.brandPartners.map((p) => (p.id === id ? updated : p)) }));
  }, []);

  const deleteBrandPartner = useCallback((id: string) => {
    setState((s) => ({ ...s, brandPartners: s.brandPartners.filter((p) => p.id !== id) }));
  }, []);

  const addBrandPartner = useCallback(() => {
    const id = newId();
    setState((s) => ({
      ...s,
      brandPartners: [...s.brandPartners, { id, name: `Brand Partner ${s.brandPartners.length + 1}`, fee: 150000, pairsPerPartner: 3, confirmedPlayers: 6 }],
    }));
  }, []);

  const updateCommunityPartner = useCallback((id: string, updated: Partner) => {
    setState((s) => ({ ...s, communityPartners: s.communityPartners.map((p) => (p.id === id ? updated : p)) }));
  }, []);

  const deleteCommunityPartner = useCallback((id: string) => {
    setState((s) => ({ ...s, communityPartners: s.communityPartners.filter((p) => p.id !== id) }));
  }, []);

  const addCommunityPartner = useCallback(() => {
    const id = newId();
    setState((s) => ({
      ...s,
      communityPartners: [...s.communityPartners, { id, name: `Community Partner ${s.communityPartners.length + 1}`, fee: 40000, pairsPerPartner: 1, confirmedPlayers: 2 }],
    }));
  }, []);

  async function handleSave() {
    setSaving(true);
    setSaveError('');
    try {
      const { error } = await supabase.from('rcc_tournament_configs').upsert(
        { config_name: state.eventName, config: state as unknown as Record<string, unknown>, updated_at: new Date().toISOString() },
        { onConflict: 'config_name' }
      );
      if (error) throw error;
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const meetsTarget = metrics.rrcEarnings >= state.targetEarnings;

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <h1 className="text-white font-black text-2xl tracking-widest uppercase">Tournament Dashboard</h1>
        <p className="text-white/40 text-sm mt-1 tracking-wide">Financial planning for {state.eventName}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column — Inputs */}
        <div className="lg:w-[40%]">
          {/* Event Settings */}
          <Section title="Event Settings">
            <div className="space-y-3">
              <div>
                <Label>Event Name</Label>
                <Input
                  value={state.eventName}
                  onChange={(v) => setState((s) => ({ ...s, eventName: v }))}
                />
              </div>
              <div>
                <Label>Event Duration</Label>
                <div className="flex gap-2">
                  {[1, 2].map((d) => (
                    <button
                      key={d}
                      onClick={() => setState((s) => ({ ...s, eventDays: d }))}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold tracking-widest uppercase transition-all ${
                        state.eventDays === d
                          ? 'bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white'
                          : 'bg-[#0F1520] border border-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      {d} Day{d > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Target RRC Earnings</Label>
                  <Input
                    type="number"
                    value={state.targetEarnings}
                    onChange={(v) => setState((s) => ({ ...s, targetEarnings: Number(v) }))}
                  />
                </div>
                <div>
                  <Label>Player Fee (≤₹1,000)</Label>
                  <Input
                    type="number"
                    value={state.playerFee}
                    onChange={(v) => setState((s) => ({ ...s, playerFee: Math.min(Number(v), 1000) }))}
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* Brand Partners */}
          <Section title={`Brand Partners (${state.brandPartners.length})`}>
            {state.brandPartners.map((p) => (
              <PartnerCard
                key={p.id}
                partner={p}
                onChange={(updated) => updateBrandPartner(p.id, updated)}
                onDelete={() => deleteBrandPartner(p.id)}
              />
            ))}
            <button
              onClick={addBrandPartner}
              className="w-full py-2.5 border border-dashed border-white/20 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-lg text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add Brand Partner
            </button>
          </Section>

          {/* Community Partners */}
          <Section title={`Community Partners (${state.communityPartners.length})`}>
            {state.communityPartners.map((p) => (
              <PartnerCard
                key={p.id}
                partner={p}
                onChange={(updated) => updateCommunityPartner(p.id, updated)}
                onDelete={() => deleteCommunityPartner(p.id)}
              />
            ))}
            <button
              onClick={addCommunityPartner}
              className="w-full py-2.5 border border-dashed border-white/20 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-lg text-sm font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> Add Community Partner
            </button>
          </Section>

          {/* Sponsorship */}
          <Section title="Sponsorship">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-sm font-bold">Paid Sponsor</span>
                  <Toggle
                    on={state.sponsorship.paidSponsor.enabled}
                    onChange={(v) =>
                      setState((s) => ({
                        ...s,
                        sponsorship: { ...s.sponsorship, paidSponsor: { ...s.sponsorship.paidSponsor, enabled: v } },
                      }))
                    }
                  />
                </div>
                {state.sponsorship.paidSponsor.enabled && (
                  <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-[#C21818]/30">
                    <div>
                      <Label>Sponsor Name</Label>
                      <Input
                        value={state.sponsorship.paidSponsor.name}
                        onChange={(v) =>
                          setState((s) => ({
                            ...s,
                            sponsorship: { ...s.sponsorship, paidSponsor: { ...s.sponsorship.paidSponsor, name: v } },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Sponsorship Amount</Label>
                      <Input
                        type="number"
                        value={state.sponsorship.paidSponsor.amount}
                        onChange={(v) =>
                          setState((s) => ({
                            ...s,
                            sponsorship: { ...s.sponsorship, paidSponsor: { ...s.sponsorship.paidSponsor, amount: Number(v) } },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-sm font-bold">Barter Shuttle Sponsor</span>
                  <Toggle
                    on={state.sponsorship.barterShuttle.enabled}
                    onChange={(v) =>
                      setState((s) => ({
                        ...s,
                        sponsorship: { ...s.sponsorship, barterShuttle: { ...s.sponsorship.barterShuttle, enabled: v } },
                      }))
                    }
                  />
                </div>
                {state.sponsorship.barterShuttle.enabled && (
                  <div className="grid grid-cols-2 gap-3 pl-2 border-l-2 border-[#D4AF37]/30">
                    <div>
                      <Label>Sponsor Name</Label>
                      <Input
                        value={state.sponsorship.barterShuttle.name}
                        onChange={(v) =>
                          setState((s) => ({
                            ...s,
                            sponsorship: { ...s.sponsorship, barterShuttle: { ...s.sponsorship.barterShuttle, name: v } },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <Label>Barter Value</Label>
                      <Input
                        type="number"
                        value={state.sponsorship.barterShuttle.value}
                        onChange={(v) =>
                          setState((s) => ({
                            ...s,
                            sponsorship: { ...s.sponsorship, barterShuttle: { ...s.sponsorship.barterShuttle, value: Number(v) } },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Vendors & Sundowner */}
          <Section title="Vendors & Sundowner">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Vendor Stalls</Label>
                  <Input
                    type="number"
                    value={state.vendorStalls.count}
                    onChange={(v) => setState((s) => ({ ...s, vendorStalls: { ...s.vendorStalls, count: Number(v) } }))}
                  />
                </div>
                <div>
                  <Label>Fee Per Stall</Label>
                  <Input
                    type="number"
                    value={state.vendorStalls.feePerStall}
                    onChange={(v) => setState((s) => ({ ...s, vendorStalls: { ...s.vendorStalls, feePerStall: Number(v) } }))}
                  />
                </div>
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/70 text-sm font-bold">Sundowner Event</span>
                  <Toggle
                    on={state.sundowner.enabled}
                    onChange={(v) => setState((s) => ({ ...s, sundowner: { ...s.sundowner, enabled: v } }))}
                  />
                </div>
                {state.sundowner.enabled && (
                  <div className="space-y-3 pl-2 border-l-2 border-[#D9FF00]/20">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>General Ticket Price</Label>
                        <Input
                          type="number"
                          value={state.sundowner.generalTicketPrice}
                          onChange={(v) => setState((s) => ({ ...s, sundowner: { ...s.sundowner, generalTicketPrice: Number(v) } }))}
                        />
                      </div>
                      <div>
                        <Label>General Attendees</Label>
                        <Input
                          type="number"
                          value={state.sundowner.generalAttendees}
                          onChange={(v) => setState((s) => ({ ...s, sundowner: { ...s.sundowner, generalAttendees: Number(v) } }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-xs tracking-widest uppercase">VIP Tickets</span>
                      <Toggle
                        on={state.sundowner.vipEnabled}
                        onChange={(v) => setState((s) => ({ ...s, sundowner: { ...s.sundowner, vipEnabled: v } }))}
                      />
                    </div>
                    {state.sundowner.vipEnabled && (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>VIP Ticket Price</Label>
                          <Input
                            type="number"
                            value={state.sundowner.vipTicketPrice}
                            onChange={(v) => setState((s) => ({ ...s, sundowner: { ...s.sundowner, vipTicketPrice: Number(v) } }))}
                          />
                        </div>
                        <div>
                          <Label>VIP Attendees</Label>
                          <Input
                            type="number"
                            value={state.sundowner.vipAttendees}
                            onChange={(v) => setState((s) => ({ ...s, sundowner: { ...s.sundowner, vipAttendees: Number(v) } }))}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Section>

          {/* Costs */}
          <Section title="Costs">
            <div className="space-y-5">
              <div>
                <div className="text-white/40 text-xs tracking-widest uppercase mb-3">One-Time Costs</div>
                {state.costs.oneTime.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          costs: {
                            ...s.costs,
                            oneTime: s.costs.oneTime.map((c) => (c.id === item.id ? { ...c, label: e.target.value } : c)),
                          },
                        }))
                      }
                      className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none flex-[2]"
                    />
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          costs: {
                            ...s.costs,
                            oneTime: s.costs.oneTime.map((c) => (c.id === item.id ? { ...c, amount: Number(e.target.value) } : c)),
                          },
                        }))
                      }
                      className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none flex-1 min-w-0"
                    />
                    {item.deletable ? (
                      <button
                        onClick={() =>
                          setState((s) => ({
                            ...s,
                            costs: { ...s.costs, oneTime: s.costs.oneTime.filter((c) => c.id !== item.id) },
                          }))
                        }
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-[#C21818] hover:border-[#C21818]/40 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    ) : (
                      <div className="w-8 h-8 flex-shrink-0" />
                    )}
                  </div>
                ))}
                <button
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      costs: {
                        ...s.costs,
                        oneTime: [...s.costs.oneTime, { id: newId(), label: 'New Cost', amount: 0, deletable: true }],
                      },
                    }))
                  }
                  className="w-full py-2 border border-dashed border-white/20 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Plus size={12} /> Add Cost
                </button>
              </div>

              <div className="border-t border-white/5 pt-4">
                <div className="text-white/40 text-xs tracking-widest uppercase mb-3">Per-Day Costs (×{state.eventDays})</div>
                {state.costs.perDay.map((item) => (
                  <div key={item.id} className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          costs: {
                            ...s.costs,
                            perDay: s.costs.perDay.map((c) => (c.id === item.id ? { ...c, label: e.target.value } : c)),
                          },
                        }))
                      }
                      className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none flex-[2]"
                    />
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) =>
                        setState((s) => ({
                          ...s,
                          costs: {
                            ...s.costs,
                            perDay: s.costs.perDay.map((c) => (c.id === item.id ? { ...c, amount: Number(e.target.value) } : c)),
                          },
                        }))
                      }
                      className="bg-[#0F1520] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-[#C21818] outline-none flex-1 min-w-0"
                    />
                    <button
                      onClick={() =>
                        setState((s) => ({
                          ...s,
                          costs: { ...s.costs, perDay: s.costs.perDay.filter((c) => c.id !== item.id) },
                        }))
                      }
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-[#C21818] hover:border-[#C21818]/40 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      costs: {
                        ...s.costs,
                        perDay: [...s.costs.perDay, { id: newId(), label: 'New Per-Day Cost', amount: 0 }],
                      },
                    }))
                  }
                  className="w-full py-2 border border-dashed border-white/20 text-white/50 hover:border-[#D4AF37] hover:text-[#D4AF37] rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2 mt-2"
                >
                  <Plus size={12} /> Add Per-Day Cost
                </button>
              </div>

              <div className="border-t border-white/5 pt-4">
                <Label>Contingency Buffer (%)</Label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={25}
                    step={1}
                    value={state.costs.contingencyPct}
                    onChange={(e) =>
                      setState((s) => ({ ...s, costs: { ...s.costs, contingencyPct: Number(e.target.value) } }))
                    }
                    className="flex-1 accent-[#C21818]"
                  />
                  <span className="text-white font-bold text-sm w-10 text-right">{state.costs.contingencyPct}%</span>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column — Results */}
        <div className="lg:w-[60%]">
          {/* Big Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <MetricCard
              label="Total Revenue"
              value={formatINR(metrics.totalRevenue)}
              gradient="bg-gradient-to-br from-[#C21818] to-[#8B0000] rounded-xl p-5"
              sub={`${metrics.totalPlayers} players`}
            />
            <MetricCard
              label="Total Costs"
              value={formatINR(metrics.totalCosts)}
              sub={`${state.costs.contingencyPct}% contingency`}
            />
            <MetricCard
              label="RRC Earnings"
              value={formatINR(metrics.rrcEarnings)}
              gradient={`${meetsTarget ? 'bg-gradient-to-br from-[#8B6914] to-[#5A4009]' : 'bg-gradient-to-br from-[#7f1d1d] to-[#450a0a]'} rounded-xl p-5`}
              sub={meetsTarget ? `↑ ${formatINR(metrics.rrcEarnings - state.targetEarnings)} above target` : `↓ ${formatINR(state.targetEarnings - metrics.rrcEarnings)} below target`}
            />
          </div>

          {/* Target Progress */}
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-xs tracking-widest uppercase">Target Progress</span>
              <span className="text-white font-bold text-sm">{Math.round((metrics.rrcEarnings / state.targetEarnings) * 100)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${meetsTarget ? 'bg-gradient-to-r from-[#D4AF37] to-[#F0CC55]' : 'bg-gradient-to-r from-[#C21818] to-[#FF4444]'}`}
                style={{ width: `${Math.min((metrics.rrcEarnings / state.targetEarnings) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-white/30 text-xs">₹0</span>
              <span className="text-white/30 text-xs">{formatINR(state.targetEarnings)}</span>
            </div>
          </div>

          {/* Revenue Breakdown */}
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 mb-4">
            <div className="text-white/60 text-xs tracking-widest uppercase mb-4">Revenue Breakdown</div>
            <table className="w-full">
              <tbody>
                <TableRow label="Brand Partnerships" value={formatINR(metrics.brandPartnerRevenue)} />
                <TableRow label="Community Partnerships" value={formatINR(metrics.communityPartnerRevenue)} />
                <TableRow label={`Player Fees (${metrics.totalPlayers} players)`} value={formatINR(metrics.playerFeeRevenue)} />
                <TableRow label="Registration Fees" value={formatINR(metrics.registrationFeeRevenue)} />
                {metrics.paidSponsorRevenue > 0 && (
                  <TableRow label={`Paid Sponsor${state.sponsorship.paidSponsor.name ? ` (${state.sponsorship.paidSponsor.name})` : ''}`} value={formatINR(metrics.paidSponsorRevenue)} />
                )}
                {metrics.barterValue > 0 && (
                  <TableRow label={`Barter Value${state.sponsorship.barterShuttle.name ? ` (${state.sponsorship.barterShuttle.name})` : ''}`} value={formatINR(metrics.barterValue)} />
                )}
                {metrics.vendorRevenue > 0 && (
                  <TableRow label={`Vendor Stalls (${state.vendorStalls.count})`} value={formatINR(metrics.vendorRevenue)} />
                )}
                {metrics.sundownerRevenue > 0 && (
                  <TableRow label="Sundowner Event" value={formatINR(metrics.sundownerRevenue)} />
                )}
                <TableRow label="TOTAL REVENUE" value={formatINR(metrics.totalRevenue)} highlight />
              </tbody>
            </table>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 mb-4">
            <div className="text-white/60 text-xs tracking-widest uppercase mb-4">Cost Breakdown</div>
            <table className="w-full">
              <tbody>
                {state.costs.oneTime.map((item) => (
                  <TableRow key={item.id} label={item.label} value={formatINR(item.amount)} />
                ))}
                {state.costs.perDay.map((item) => (
                  <TableRow key={item.id} label={`${item.label} (×${state.eventDays})`} value={formatINR(item.amount * state.eventDays)} />
                ))}
                <TableRow label={`Contingency (${state.costs.contingencyPct}%)`} value={formatINR(metrics.contingencyAmount)} />
                <TableRow label="TOTAL COSTS" value={formatINR(metrics.totalCosts)} highlight />
              </tbody>
            </table>
          </div>

          {/* Prize Distribution */}
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 mb-4">
            <div className="text-white/60 text-xs tracking-widest uppercase mb-4">Prize Distribution</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { pos: '1st', amount: 25000, color: 'text-[#D4AF37]', bg: 'bg-[#D4AF37]/10 border-[#D4AF37]/20' },
                { pos: '2nd', amount: 15000, color: 'text-white/70', bg: 'bg-white/5 border-white/10' },
                { pos: '3rd', amount: 5000, color: 'text-[#CD7F32]', bg: 'bg-[#CD7F32]/10 border-[#CD7F32]/20' },
              ].map(({ pos, amount, color, bg }) => (
                <div key={pos} className={`rounded-lg p-3 border ${bg} text-center`}>
                  <div className={`font-black text-lg ${color}`}>{pos}</div>
                  <div className="text-white font-bold text-sm">{formatINR(amount)}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-white/40 text-xs tracking-widest uppercase">Total Prize Pool</span>
              <span className="text-white font-bold">{formatINR(metrics.prizePoolAmount)}</span>
            </div>
          </div>

          {/* Gross Surplus */}
          <div className="bg-[#0A0E1A] border border-white/10 rounded-xl p-5 mb-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-white/40 text-xs tracking-widest uppercase mb-1">Gross Surplus</div>
                <div className={`text-xl font-black ${metrics.grossSurplus >= 0 ? 'text-[#D9FF00]' : 'text-[#C21818]'}`}>
                  {formatINR(metrics.grossSurplus)}
                </div>
              </div>
              <div>
                <div className="text-white/40 text-xs tracking-widest uppercase mb-1">Management Fee</div>
                <div className="text-xl font-black text-[#D4AF37]">{formatINR(metrics.mgmtFee)}</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
              <span className="text-white/60 text-xs tracking-widest uppercase">RRC Earnings = Mgmt Fee + Surplus</span>
              <span className={`font-black text-lg ${meetsTarget ? 'text-[#D4AF37]' : 'text-[#C21818]'}`}>
                {formatINR(metrics.rrcEarnings)}
              </span>
            </div>
          </div>

          {/* Save Button */}
          <div className="sticky bottom-6">
            {saveError && (
              <div className="bg-[#C21818]/10 border border-[#C21818]/30 rounded-lg px-4 py-3 text-[#C21818] text-sm mb-3">
                {saveError}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3.5 bg-gradient-to-r from-[#C21818] to-[#8B0000] text-white font-black rounded-xl tracking-widest uppercase text-sm transition-all hover:shadow-[0_0_30px_rgba(194,24,24,0.4)] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <CheckCircle size={16} /> Saved to Cloud
                </>
              ) : saving ? (
                'Saving…'
              ) : (
                <>
                  <Save size={16} /> Save to Cloud
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
