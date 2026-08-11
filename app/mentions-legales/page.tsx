export const metadata = { title: "Mentions légales — Chauffeur Rapide" };

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
        Mentions légales &amp; confidentialité
      </h1>

      <div className="mt-6 flex flex-col gap-6 text-stone-700">
        <section>
          <h2 className="font-bold text-stone-900">Éditeur</h2>
          <p className="mt-1 text-sm">
            Chauffeur Rapide — plateforme de mise en relation entre chauffeurs
            et personnes recherchant un chauffeur en Côte d&apos;Ivoire.
            Projet MVP à but de démonstration.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-900">Données collectées</h2>
          <p className="mt-1 text-sm">
            Nous collectons les informations nécessaires à la mise en relation
            : identité, coordonnées, catégorie et zone de travail pour les
            chauffeurs ; nom et téléphone pour les demandes clients. Les
            pièces d&apos;identité et permis de conduire fournis par les
            chauffeurs sont utilisés uniquement pour la vérification des
            profils par notre équipe et ne sont jamais rendus publics.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-900">Sécurité des documents</h2>
          <p className="mt-1 text-sm">
            Les documents sensibles (pièce d&apos;identité, permis) sont
            stockés hors des dossiers publics du site et ne sont accessibles
            qu&apos;au chauffeur concerné et à notre équipe de vérification.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-900">Vérification des profils</h2>
          <p className="mt-1 text-sm">
            Un profil chauffeur n&apos;est affiché comme « vérifié » qu&apos;après
            contrôle de ses documents par un administrateur. Un profil en
            attente reste visible mais signalé comme tel.
          </p>
        </section>

        <section>
          <h2 className="font-bold text-stone-900">Contact</h2>
          <p className="mt-1 text-sm">
            Pour toute question relative à vos données ou à votre profil,
            contactez notre équipe via WhatsApp ou par téléphone.
          </p>
        </section>
      </div>
    </div>
  );
}
