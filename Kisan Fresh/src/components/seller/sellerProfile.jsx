import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [seller_profile, setseller_profile] = useState({
    name: "",
    upi_id: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(successget, errorget);
    } else {
      toast.error("Geolocation is not supported by this browser.");
    }
  }

  function successget(position) {
    setseller_profile((prev) => ({
      ...prev,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    }));
  }

  function errorget() {
    toast.error("Sorry, no position available.");
  }

  // get request for profile
  const getProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.get(`http://127.0.0.1:8000/seller_profile/`, {
        withCredentials: true,
      });
      console.log(res.data.profile);
      const data = res.data.profile;
      setProfile(data);
      setseller_profile({
        name: data.name || "",
        upi_id: data.upi_id || "",
        address: data.address || "",
        latitude: data.latitude || "",
        longitude: data.longitude || "",
      });
      setIsEditing(false);
    } catch (err) {
      // Profile doesn't exist
      if (err.response && err.response.status === 404) {
        setProfile(null);
      } else {
        const msg = err.response?.data?.error || "Failed to load profile";
        setError(msg);
      }
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!seller_profile.upi_id.trim()) return "UPI ID is required";
    if (!seller_profile.address.trim()) return "address is required";
    if (!seller_profile.name.trim()) return "name is required";
    if (!seller_profile.latitude || isNaN(Number(seller_profile.latitude)))
      return "Valid latitude is required";
    if (!seller_profile.longitude || isNaN(Number(seller_profile.longitude)))
      return "Valid longitude is required";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setseller_profile((prev) => ({ ...prev, [name]: value }));
  };

  const createProfile = async (e) => {
    e.preventDefault();
    setError("");

    const val = validate();
    if (val) {
      setError(val);
      return;
    }

    setSubmitting(true);
    try {
      const profile = new FormData();
      profile.append("name", seller_profile.name);
      profile.append("upi_id", seller_profile.upi_id);
      profile.append("address", seller_profile.address);
      profile.append("latitude", seller_profile.latitude);
      profile.append("longitude", seller_profile.longitude);

      const res = await axios.post(
        `http://127.0.0.1:8000/seller_profile/`,
        profile,
        {
          withCredentials: true,
        }
      );

      setSuccess(res.data?.message || "Profile created successfully.");

      
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
        setError("No response from server. Check server.");
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
      await getProfile();
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const val = validate();
    if (val) {
      setError(val);
      return;
    }

    try {
      const profile = {
        "name": seller_profile.name,
        "upi_id": seller_profile.upi_id,
        "address": seller_profile.address,
        "latitude": seller_profile.latitude,
        "longitude": seller_profile.longitude,
      }
      const res = await axios.put(
        `http://127.0.0.1:8000/seller_profile/`,
        profile,
        {
          withCredentials: true,
        }
      );

      setSuccess(res.data?.message || "Profile updated successfully.");

      
      setProfile((p) => ({
        ...(p || {}),
        name: seller_profile.name,
        upi_id: seller_profile.upi_id,
        address: seller_profile.address,
        latitude: seller_profile.latitude,
        longitude: seller_profile.longitude,
      }));
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.error || JSON.stringify(err.response.data));
      } else if (err.request) {
        setError("No response from server. Check server.");
      } else {
        setError(err.message);
      }
    } finally {
      setSubmitting(false);
      await getProfile();
    }
  };

  useEffect(() => {
    getProfile();
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
                    onClick={() => {
                      setSuccess("");
                      setError("");
                      setseller_profile({
                        name: profile.name,
                        upi_id: profile.upi_id,
                        address: profile.address,
                        latitude: profile.latitude,
                        longitude: profile.longitude,
                      });
                      setIsEditing(true);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              // editing
              <form
                onSubmit={profile ? updateProfile : createProfile}
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
                      disabled={true}
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
                      disabled={true}
                      name="longitude"
                      value={seller_profile.longitude}
                      onChange={handleChange}
                      className={`${inputBase} border-gray-300`}
                      placeholder="e.g. 77.1025"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div
                    className=" max-w-fit  mt-2 px-4 py-2 rounded-md bg-sky-200 hover:bg-sky-300"
                    onClick={getLocation}
                  >
                    Use Current Location
                  </div>
                )}

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
