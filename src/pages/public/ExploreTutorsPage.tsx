import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  Star,
  BookOpen,
  Calendar,
  CheckCircle,
  X,
  AlertCircle,
} from 'lucide-react';
import { useDemo } from '../../context/DemoContext';
import { Avatar } from '../../components/common/Avatar';
import { StarRating } from '../../components/common/StarRating';
import { formatEGP } from '../../utils/currency';
import { BookingModal } from '../../components/modals/BookingModal';
import { User } from '../../types';

export const ExploreTutorsPage: React.FC = () => {
  const { state } = useDemo();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [maxPriceEgp, setMaxPriceEgp] = useState<number>(500);
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating');
  const [selectedTutorForBooking, setSelectedTutorForBooking] = useState<User | null>(null);

  // Business Rule:
  // "Approved, active tutors should appear in student search. Pending, rejected, suspended, or booking-restricted tutors should not accept new bookings."
  const availableTutors = useMemo(() => {
    return state.users.filter((u) => {
      if (u.role !== 'tutor') return false;
      if (u.status !== 'active') return false;
      if (u.applicationStatus !== 'approved') return false;
      if (u.isBookingRestricted) return false;
      return true;
    });
  }, [state.users]);

  // Restricted or pending tutors (for demo visibility in an educational note)
  const restrictedOrPendingCount = state.users.filter(
    (u) =>
      u.role === 'tutor' &&
      (u.status === 'suspended' || u.applicationStatus !== 'approved' || u.isBookingRestricted)
  ).length;

  const filteredTutors = useMemo(() => {
    return availableTutors
      .filter((tutor) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesName = tutor.name.toLowerCase().includes(query);
        const matchesSubject = tutor.subjects?.some((s) => s.toLowerCase().includes(query));
        const matchesBio = tutor.bio?.toLowerCase().includes(query);
        const matchesSearch = !query || matchesName || matchesSubject || matchesBio;

        // Subject filter
        const matchesSelectedSubject =
          selectedSubject === 'all' || tutor.subjects?.includes(selectedSubject);

        // Price filter (hourlyRateMinorUnits / 100)
        const priceEgp = (tutor.hourlyRateMinorUnits || 30000) / 100;
        const matchesPrice = priceEgp <= maxPriceEgp;

        return matchesSearch && matchesSelectedSubject && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        }
        if (sortBy === 'price_asc') {
          return (a.hourlyRateMinorUnits || 0) - (b.hourlyRateMinorUnits || 0);
        }
        if (sortBy === 'price_desc') {
          return (b.hourlyRateMinorUnits || 0) - (a.hourlyRateMinorUnits || 0);
        }
        return 0;
      });
  }, [availableTutors, searchQuery, selectedSubject, maxPriceEgp, sortBy]);

  return (
    <div className="space-y-8 py-6">
      {/* Page Title & Intro */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Find Your Perfect Private Tutor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Browse verified subject experts across Egypt with transparent pricing and live calendar availability.
        </p>
      </div>

      {/* Business Rule Notice */}
      {restrictedOrPendingCount > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Showing only <strong>approved and active</strong> tutors ({availableTutors.length} available).
              {restrictedOrPendingCount} unapproved or booking-restricted profile(s) are filtered out according to platform rules.
            </span>
          </div>
          <Link
            to="/admin/applications"
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 shrink-0 ml-2"
          >
            Inspect in Admin ➔
          </Link>
        </div>
      )}

      {/* Search & Filter Controls Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by tutor name, subject, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Subject Dropdown */}
          <div className="md:col-span-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Subjects</option>
              {state.settings.supportedSubjects.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="rating">Sort: Highest Rating</option>
              <option value="price_asc">Sort: Price (Low to High)</option>
              <option value="price_desc">Sort: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {/* Price Slider Filter & Active Filters Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Max Rate:
            </span>
            <input
              type="range"
              min="150"
              max="500"
              step="25"
              value={maxPriceEgp}
              onChange={(e) => setMaxPriceEgp(parseInt(e.target.value, 10))}
              className="w-36 accent-indigo-600 cursor-pointer"
            />
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              Up to EGP {maxPriceEgp}/hr
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Found <strong>{filteredTutors.length}</strong> matching tutor(s)
          </div>
        </div>
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No tutors found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query, increasing your maximum hourly price, or selecting "All Subjects".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('all');
              setMaxPriceEgp(500);
            }}
            className="px-4 py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all hover:border-slate-300"
            >
              <div>
                <div className="flex items-start gap-3.5">
                  <Avatar
                    name={tutor.name}
                    size="lg"
                    avatarColor={tutor.avatarColor}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-slate-900 truncate">
                      {tutor.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{tutor.headline}</p>
                    <div className="mt-1">
                      <StarRating
                        rating={tutor.rating || 5}
                        totalReviews={tutor.reviewCount}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {tutor.bio}
                </p>

                {/* Subject tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {tutor.subjects?.map((sub) => (
                    <span
                      key={sub}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Book CTA */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Session Rate
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {formatEGP(tutor.hourlyRateMinorUnits || 30000)}
                    <span className="text-xs font-normal text-slate-500"> / hr</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/tutor/${tutor.id}`}
                    className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    View Bio
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedTutorForBooking(tutor)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={selectedTutorForBooking !== null}
        tutor={selectedTutorForBooking}
        onClose={() => setSelectedTutorForBooking(null)}
      />
    </div>
  );
};
