import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState(null); //data from server
  const [isEditing, setIsEditing] = useState(false); //for toggleing edit and view

  const [seller_profile, setseller_profile] = useState({
    name: "",
    upi_id: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  // get request for profile
  const getProfile = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `http://localhost:8000/seller_profile_view/`,
        axiosCfg()
      );

      // Success: Set the profile data
      if (res.data && res.data.profile) {
        const data = res.data.profile;
        setProfile(data);

        // Pre-fill the form state in case user wants to edit immediately
        setseller_profile({
          name: data.name || "",
          upi_id: data.upi_id || "",
          address: data.address || "",
          latitude: data.latitude || "",
          longitude: data.longitude || "",
        });
        setIsEditing(false);
      }
    } catch (err) {
      // Handle 404: Profile doesn't exist -> Go to Create Mode
      if (err.response && err.response.status === 404) {
        setProfile(null);
        setIsEditing(true);
      } else {
        // Handle other errors (500, Network, etc)
        const msg = err.response?.data?.error || "Failed to load profile";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Basic validation: return null if valid or error string
  const validate = () => {
    if (!seller_profile.upi_id.trim()) return "UPI ID is required";
    if (!seller_profile.address.trim()) return "address is required";
    if (!seller_profile.name.trim()) return "name is required";
    if (
      !seller_profile.latitude.trim() ||
      isNaN(Number(seller_profile.latitude))
    )
      return "Valid latitude is required";
    if (
      !seller_profile.longitude.trim() ||
      isNaN(Number(seller_profile.longitude))
    )
      return "Valid longitude is required";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setseller_profile((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    const val = validate();
    if (val) {
      setError(val);
      return;
    }

    try {
      const payload = {
        name: seller_profile.name,
        upi_id: seller_profile.upi_id,
        address: seller_profile.address,
        latitude: seller_profile.latitude,
        longitude: seller_profile.longitude,
      };

      const res = await axios.put(`${API_BASE}/seller_profile_view/`, payload, {
        ...axiosCfg(),
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(res.data?.message || "Profile updated successfully.");

      // update profile locally
      setProfile((p) => ({
        ...(p || {}),
        name: seller_profile.name,
        upi_id: seller_profile.upi_id,
        address: seller_profile.address,
        latitude: seller_profile.latitude,
        longitude: seller_profile.longitude,
      }));

      setIsEditing(false);
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || JSON.stringify(err.response.data));
      } else if (err.request) {
        setError("No response from server. Check server / CORS.");
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Update profile (PUT)
  const handleUpdate = async (e) => {
    e?.preventDefault();
    // TODO: implement PUT logic (send JSON to seller_profile_view)
    // - validate -> if invalid setError(...)
    // - setSubmitting(true) / setSubmitting(false)
    // - setSuccess / setError accordingly
    // - on success update local profile state and setIsEditing(false)
  };

  // If you want to fetch on mount, uncomment and implement getProfile above
  useEffect(() => {
    // TODO: Uncomment when getProfile is implemented
    // getProfile();
    setLoading(false); // remove this once getProfile is wired
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inputBase =
    "block w-full rounded-md border px-3 py-2 text-sm focus:outline-none";
  const labelClass = "block text-sm font-medium text-[var(--color-text)] mb-1";

  return (
    <div className="flex items-center justify-center p-6">
      <div className="w-full max-w-2xl rounded-lg bg-surface p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-text">
          Seller Profile
        </h2>

        {loading ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : (
          <>
            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
            {success && (
              <div className="mb-3 text-sm text-green-600">{success}</div>
            )}

            {/*profile found*/}
            {profile && !isEditing ? (
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted">Name</div>
                  <div className="text-lg font-medium">{profile.name}</div>
                </div>

                <div>
                  <div className="text-sm text-muted">Email</div>
                  <div className="text-lg font-medium">{profile.email}</div>
                </div>

                <div>
                  <div className="text-sm text-muted">Mobile</div>
                  <div className="text-lg font-medium">{profile.mobile}</div>
                </div>

                <div>
                  <div className="text-sm text-muted">UPI ID</div>
                  <div className="text-lg font-medium">{profile.upi_id}</div>
                </div>

                <div>
                  <div className="text-sm text-muted">Address</div>
                  <div className="text-lg font-medium">{profile.address}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted">Latitude</div>
                    <div className="text-lg font-medium">
                      {profile.latitude}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted">Longitude</div>
                    <div className="text-lg font-medium">
                      {profile.longitude}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    className="px-4 py-2 rounded-md bg-primary text-white"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              // editing
              <form
                onSubmit={profile ? handleUpdate : handleCreate}
                className="space-y-4"
              >
                <div>
                  <label className={labelClass}>Name</label>
                  <input
                    name="name"
                    value={seller_profile.name}
                    onChange={handleChange}
                    className={`${inputBase} border-gray-300`}
                    placeholder="Full name or shop name"
                  />
                </div>

                <div>
                  <label className={labelClass}>UPI ID</label>
                  <input
                    name="upi_id"
                    value={seller_profile.upi_id}
                    onChange={handleChange}
                    className={`${inputBase} border-gray-300`}
                    placeholder="example@bank"
                  />
                </div>

                <div>
                  <label className={labelClass}>Address</label>
                  <textarea
                    name="address"
                    value={seller_profile.address}
                    onChange={handleChange}
                    className={`${inputBase} border-gray-300 min-h-[80px]`}
                    placeholder="Shop address / locality"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input
                      name="latitude"
                      value={seller_profile.latitude}
                      onChange={handleChange}
                      className={`${inputBase} border-gray-300`}
                      placeholder="e.g. 28.7041"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input
                      name="longitude"
                      value={seller_profile.longitude}
                      onChange={handleChange}
                      className={`${inputBase} border-gray-300`}
                      placeholder="e.g. 77.1025"
                    />
                  </div>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`px-4 py-2 rounded-md text-white ${
                      submitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:brightness-95"
                    }`}
                  >
                    {profile
                      ? submitting
                        ? "Updating..."
                        : "Update Profile"
                      : submitting
                      ? "Creating..."
                      : "Create Profile"}
                  </button>

                  {profile && (
                    <button
                      type="button"
                      className="px-3 py-2 rounded-md text-sm border"
                      onClick={() => {
                        setIsEditing(false);
                        setError("");
                        setSuccess("");
                        setseller_profile({
                          name: profile.name || "",
                          upi_id: profile.upi_id || "",
                          address: profile.address || "",
                          latitude: profile.latitude || "",
                          longitude: profile.longitude || "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
