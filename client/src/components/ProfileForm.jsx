const ProfileForm = ({ user, formData, setFormData, onSubmit, loading }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="mb-5 text-xl font-semibold text-slate-800">Edit profile</h2>
    <div className="grid gap-5 md:grid-cols-2">
      <label className="block text-sm font-medium text-slate-700">
        Full name
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700">
        Email
        <input
          type="email"
          value={user?.email || ''}
          disabled
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 text-slate-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700 md:col-span-2">
        Phone number
        <input
          type="text"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500"
        />
      </label>

      <label className="block text-sm font-medium text-slate-700 md:col-span-2">
        Profile image URL
        <input
          type="text"
          value={formData.profileImage}
          onChange={(e) => setFormData({ ...formData, profileImage: e.target.value })}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-indigo-500"
        />
      </label>
    </div>

    <button
      type="button"
      onClick={onSubmit}
      disabled={loading}
      className="mt-6 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-indigo-300"
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          Saving...
        </span>
      ) : 'Save changes'}
    </button>
  </div>
);

export default ProfileForm;
