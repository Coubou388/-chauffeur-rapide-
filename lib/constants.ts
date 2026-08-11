// Données de référence partagées par le seed, les formulaires et l'UI.

export const DRIVER_CATEGORIES: Array<{
  slug: string;
  label: string;
  description: string;
}> = [
  {
    slug: "taxi-compteur",
    label: "Chauffeur de taxi-compteur",
    description: "Conduite de taxi urbain au compteur.",
  },
  {
    slug: "yango-vtc",
    label: "Chauffeur Yango / VTC",
    description: "Chauffeur pour applications de VTC (Yango, Uber...).",
  },
  {
    slug: "woro-woro",
    label: "Chauffeur de wôrô-wôrô",
    description: "Taxi communal / inter-communal.",
  },
  {
    slug: "gbaka",
    label: "Chauffeur de gbaka",
    description: "Minibus de transport collectif.",
  },
  {
    slug: "personnel",
    label: "Chauffeur personnel / particulier",
    description: "Chauffeur privé pour un particulier ou une famille.",
  },
  {
    slug: "entreprise",
    label: "Chauffeur d'entreprise",
    description: "Chauffeur salarié pour une entreprise.",
  },
  {
    slug: "poids-lourd",
    label: "Chauffeur poids lourd",
    description: "Conduite de camions et poids lourds.",
  },
  {
    slug: "livreur",
    label: "Chauffeur-livreur",
    description: "Livraison de colis et marchandises.",
  },
  {
    slug: "bus-car",
    label: "Chauffeur de bus / car",
    description: "Transport en bus ou car de voyageurs.",
  },
  {
    slug: "remplacement",
    label: "Chauffeur temporaire / remplacement",
    description: "Disponible pour des missions ponctuelles ou remplacements.",
  },
];

export const COMMUNES: string[] = [
  "Abobo",
  "Adjamé",
  "Attécoubé",
  "Cocody",
  "Koumassi",
  "Marcory",
  "Plateau",
  "Port-Bouët",
  "Treichville",
  "Yopougon",
  "Bingerville",
  "Songon",
  "Anyama",
  "Bouaké",
  "Yamoussoukro",
  "San-Pédro",
  "Korhogo",
  "Daloa",
  "Man",
  "Gagnoa",
];

export const AVAILABILITY_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  BUSY: "Occupé",
  OFFLINE: "Indisponible",
};

export const DRIVER_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  IN_REVIEW: "En vérification",
  VALIDATED: "Validé",
  REJECTED: "Refusé",
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  NEW: "Nouvelle",
  CONTACTED: "Contacté",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  ID_CARD: "Pièce d'identité",
  DRIVER_LICENSE: "Permis de conduire",
  PROFILE_PHOTO: "Photo de profil",
};

// Nombre de mises en contact gratuites accordées à chaque nouveau client
// (cf lib/billing). Au-delà, la demande est créée mais reste "verrouillée".
export const FREE_CONTACTS_PER_CLIENT = 3;

export const WHATSAPP_BUSINESS_NUMBER =
  process.env.WHATSAPP_BUSINESS_NUMBER || "2250000000000";
