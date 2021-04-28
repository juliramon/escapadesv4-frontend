import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";

const PoliticaPrivadesa = () => {
  const { user } = useContext(UserContext);
  const [state, setState] = useState({ stopFixed: false });
  useEffect(() => {
    window.onscroll = () => handleScroll();
  });
  const handleScroll = () => {
    console.log("scrolling =>", document.documentElement.scrollTop);
    if (document.documentElement.scrollTop > 4250) {
      setState({ stopFixed: true });
    } else {
      setState({ stopFixed: false });
    }
  };
  let absolute = { position: "absolute", top: 150 };
  let fixed = { position: "fixed", top: 150 };
  let isFixed = state.stopFixed ? absolute : fixed;
  return (
    <>
      <Head>
        <title>Política de privadesa – Escapadesenparella.cat</title>
      </Head>
      <NavigationBar
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
        user={user}
      />
      <main id="legalTerms">
        <article>
          <Container className="mw-1200">
            <div className="box">
              <aside className="right" style={isFixed}>
                <ul>
                  <li className="sidebar-list-header">Dreceres</li>
                  <li>
                    <a href="#engeneral" title="En general" rel="nofollow">
                      En general
                    </a>
                  </li>
                  <li>
                    <a
                      href="#finalitatstractament"
                      title="Finalitats del tractament i base jurídica"
                      rel="nofollow"
                    >
                      Finalitats del tractament i base jurídica
                    </a>
                  </li>
                  <li>
                    <a
                      href="#categoriesdades"
                      title="Categories de dades"
                      rel="nofollow"
                    >
                      Categories de dades
                    </a>
                  </li>
                  <li>
                    <a
                      href="#presadecisions"
                      title="Presa de decisions automàtica"
                      rel="nofollow"
                    >
                      Presa de decisions automàtica
                    </a>
                  </li>
                  <li>
                    <a
                      href="#configuracionsprivacitat"
                      title="Configuracions de privacitat i seguretat"
                      rel="nofollow"
                    >
                      Configuracions de privacitat i seguretat
                    </a>
                  </li>
                  <li>
                    <a
                      href="#destinataris"
                      title="Destinataris i transferències de dades personals"
                      rel="nofollow"
                    >
                      Destinataris i transferències de dades personals
                    </a>
                  </li>
                  <li>
                    <a
                      href="#dretsusuaris"
                      title="Drets dels usuaris"
                      rel="nofollow"
                    >
                      Drets dels usuaris
                    </a>
                  </li>
                  <li>
                    <a
                      href="#politicacookies"
                      title="Política de cookies"
                      rel="nofollow"
                    >
                      Política de cookies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#quesoncookies"
                      title="Què són les cookies"
                      rel="nofollow"
                    >
                      Què són les cookies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#controlcookies"
                      title="Control de cookies"
                      rel="nofollow"
                    >
                      Control de cookies
                    </a>
                  </li>
                  <li>
                    <a
                      href="#quinescookiesutilitzem"
                      title="Quines cookies utilitza Escapadesenparella.cat?"
                      rel="nofollow"
                    >
                      Quines cookies utilitza Escapadesenparella.cat?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#cookiestercers"
                      title="Política de cookies de tercer"
                      rel="nofollow"
                    >
                      Política de cookies de tercers
                    </a>
                  </li>
                </ul>
              </aside>
              <div className="left">
                <section className="legal-terms-title-area">
                  <h1>Política de privadesa</h1>
                  <div className="legal-terms-sub-h1">
                    <p>
                      Política de privadesa pel lloc web{" "}
                      <u>Escapadesenparella.cat</u>
                    </p>
                    <p>Darrera actualització el 20/04/2021</p>
                  </div>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="engeneral"></span>
                  <h2>En general</h2>
                  <p>
                    Escapadesenparella.cat amb NIF 45127832-S i amb l’adreça de
                    correu electrònic social@escapadesenparella.cat, per la
                    present, informa a l’usuari de com tractarà la seva
                    informació personal.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="finalitatstractament"></span>
                  <h2>Finalitats del tractament i base jurídica</h2>
                  <p>
                    Aquesta informació personal es tractarà únicament per
                    respondre i tractar, d’acord amb les normes i regulacions de
                    la Llei de Protecció de Dades i els Serveis de la Societat
                    de la Informació, amb la finalitat de:
                  </p>
                  <ul>
                    <li>
                      Proporcionar a l’usuari accés a la pàgina web i als
                      serveis en línia
                    </li>
                    <li>
                      Donar i oferir a l’usuari els serveis
                      d’Escapadesenparella.cat
                    </li>
                    <li>
                      Posar en contacte l’usuari amb altres participants del
                      servei i els continguts d’Escapadesenparella.cat (empreses
                      i individuals)
                    </li>
                    <li>
                      Proporcionar a l’usuari informació comercial i promocional
                      relacionada directament i/o indirectament amb el sector
                      del turisme, restauració, hostaleria i/o altres serveis
                      oferts per Escapadesenparella.cat, principalment per
                      mitjans electrònics (telèfon, correu electrònic i
                      Internet), però també per qualsevol altre mitjà
                    </li>
                  </ul>
                  <p>
                    La base legal pel tractament de les dades és el consentiment
                    de l’usuari. A aquest efecte, es demana a l’usuari que doni
                    el seu consentiment a aquesta política de privadesa i que
                    accepti les condicions generals. La no acceptació d’aquesta
                    política de privadesa implicarà que els serveis prestats i
                    els continguts del lloc web oferts per
                    Escapadesenparella.cat no estaran disponibles i que
                    s’interromprà el procés de subscripció del sistema.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="categoriesdades"></span>
                  <h2>Categories de dades</h2>
                  <p>
                    L’usuari ha d’emplenar tots els camps obligatoris dels
                    formularis amb informació veraç, completa i actualitzada,
                    excepte per a detalls en què s’indiqui que el proveïment de
                    les dades és opcional, perquè Escapadesenparella.cat ho
                    requereix estrictament per poder complir amb els propòsits
                    anteriorment esmentats. En cas contrari,
                    Escapadesenparella.cat no atén la vostra sol·licitud. Els
                    usuaris garanteixen que la informació personal facilitada a
                    Escapadesenparella.cat és certa i és responsable de
                    notificar qualsevol modificació o canvi.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="presadecisions"></span>
                  <h2>Presa de decisions automàtica</h2>
                  <p>
                    Escapadesenparella.cat informa als usuaris que, mitjançant
                    l’ús dels serveis, es procedirà a la presa de decisions
                    automatitzades, inclosa la creació de perfils i/o fitxes de
                    contingut. L’objectiu d’aquest tractament és l’adequació
                    dels propòsits enumerats en anterioritat.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="configuracionsprivacitat"></span>
                  <h2>Configuracions de privacitat i seguretat</h2>
                  <p>
                    Escapadesenparella.cat es reserva el dret de modificar
                    aquesta política per adaptar-la a les noves normatives o
                    jurisprudències i pràctiques industrials i/o comercials.
                  </p>
                  <p>
                    Si Escapadesenparella.cat decideix canviar la seva política
                    de privadesa, publicarà aquests canvis en la present pàgina.
                  </p>
                  <p>
                    En qualsevol cas, els usuaris han de llegir i acceptar
                    expressament el consentiment del tractament de les dades
                    referit per aquesta Política de privadesa abans d’utilitzar
                    els serveis oferts per Escapadesenparella.cat.
                  </p>
                  <p>
                    Escapadesenparella.cat ha adoptat les mesures de seguretat
                    de protecció de dades legalment requerides i s’esforça per
                    instal·lar contínuament mesures i mitjans tècnics
                    addicionals dins del seu àmbit per evitar la pèrdua, l’ús
                    indegut, l’alteració, l’accés no autoritzat i/o el robatori
                    de les dades personals proporcionades.
                    Escapadesenparella.cat es compromet a utilitzar tota la
                    informació enviada pels usuaris registrats amb la màxima
                    confidencialitat i professionalitat.
                  </p>
                  <p>
                    Escapadesenparella.cat emmagatzemarà les dades personals
                    fins que les dades personals deixin de ser necessàries per a
                    les finalitats per a les quals van ser recopilades o quan
                    l’interessat retiri el consentiment en que es basa el
                    tractament de les mateixes. No s’aplicaran i les dades
                    personals es conservaran emmagatzemades quan aquest
                    tractament sigui necessari per al compliment d’una obligació
                    legal.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="destinataris"></span>
                  <h2>Destinataris i transferències de dades personals</h2>
                  <p>
                    Escapadesenparella.cat garanteix que, en cap casa,
                    notificarà ni cedirà aquestes dades a tercers, tret que ho
                    autoritzin expressament els usuaris. Les dades es podrien
                    comunicar als tercers destinataris següents:
                  </p>
                  <ul>
                    <li>
                      Administracions públiques per al compliment de les
                      obligacions legals
                    </li>
                    <li>
                      Proveïdors de serveis de comunicacions electròniques,
                      allotjament, serveis SaaS com CRM/ERP, gestió,
                      comptabilitat, auditoria i advocats
                    </li>
                    <li>
                      Escapadesenparella.cat podria transferir dades personals a
                      destinataris ubicats a tercers països i amb els quals
                      s’han formalitzat les clàusules contractuals estàndard
                      sobre protecció de dades adoptades per la Comissió Europea
                      (Decisió Comunitària (EU) 2010/87 / EU).
                    </li>
                  </ul>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="dretsusuaris"></span>
                  <h2>Drets dels usuaris</h2>
                  <p>
                    Els usuaris tenen dret, en qualsevol moment, a exercir els
                    seus drets d’accés, rectificació, eliminació, restricció de
                    tractament, portabilitat de dades i objecte, posant-se en
                    contacte amb Escapadesenparella.cat i enviament una
                    notificació per escrit a gdpr@escapadesenparella.cat,
                    adjuntant una còpia del seu document nacional d’identitat o
                    un altre document d’identitat equivalent. Els usuaris tenen
                    dret a retirar el consentiment en qualsevol moment, sense
                    afectar la licitud del tractament basa en el consentiment
                    abans de la seva retirada. Els usuaris també tenen dret a
                    presentar una reclamació davant una autoritat de control.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="politicacookies"></span>
                  <h2>Política de cookies</h2>
                  <p>
                    En utilitzar els serveis oferts per Escapadesenparella.cat,
                    l’usuari accepta l’ús de cookies mitjançant aquesta Política
                    de cookies. L’usuari haurà vist una notificació a aquest
                    efecte a la primera visita a aquest lloc web. Tot i que no
                    sol aparèixer en visites posteriors, podeu retirar el vostre
                    consentiment en qualsevol moment seguint les instruccions
                    següents.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="quesoncookies"></span>
                  <h2>Què són les cookies</h2>
                  <p>
                    Escapadesenparella.cat utilitza informació obtinguda sobre
                    l’usuari a partir de cookies o tecnologies similars. Les
                    cookies són fitxers de text que contenen petites quantitats
                    d’informació que Escapadesenparella.cat descarrega a
                    l’ordinador o dispositiu de l’usuari quan visita el lloc web{" "}
                    <a
                      href="https://escapadesenparella.cat"
                      title="escapadesenparella.cat"
                    >
                      www.escapadesenparella.cat
                    </a>
                    , o qualsevol pàgina sota el domini{" "}
                    <a
                      href="https://escapadesenparella.cat"
                      title="escapadesenparella.cat"
                    >
                      www.escapadesenparella.cat
                    </a>
                    . Escapadesenparella.cat reconeix aquestes cookies en
                    visites posteriors perquè permeten al nostre sistema
                    recordar l’informació de l’usuari.
                  </p>
                  <p>
                    Les cookies es presenten de moltes formes, a continuació
                    s’exposen les principals tipologies:
                  </p>
                  <ul>
                    <li>
                      <b>Cookies de primers i tercers:</b> Si una cookie és
                      pròpia o de tercers, es fa referència al domini que
                      col·loca la cookie. Les cookies pròpies són les que
                      estableix un lloc web que l’usuari visita. Les cookies de
                      tercers són cookies establertes per un domini diferent del
                      del lloc web que l’usuari visita. Si un usuari visita un
                      lloc web i una altra entitat estableix una cookie a través
                      d’aquest lloc web, aquesta seria una cookie de tercers.
                      <br />
                      <br />
                      Si l’usuari va a una pàgina web que conté contingut
                      incrustat, se li enviaran cookies des d’aquests llocs web.
                      Escapadesenparella.cat no controla la configuració
                      d’aquestes cookies, així que recomana consultar els llocs
                      web de tercers per obtenir més informació sobre les seves
                      cookies i sobre com gestionar-les.
                    </li>
                    <li>
                      <b>Cookies persistents:</b> Aquestes cookies romanen al
                      dispositiu de l’usuari durant el període especificat a la
                      cookie. S’activen cada vegada que l’usuari visita el lloc
                      web que va crear la cookie.
                    </li>
                    <li>
                      <b>Cookies de sessió:</b> Aquestes cookies permeten als
                      operadors de llocs web vincular les accions d’un usuari
                      durant una sessió del navegador. Una sessió del navegador
                      comença quan l’usuari obre la finestra del navegador i
                      acaba quan tanca la finestra del navegador. Les cookies de
                      sessió es creen temporalment. Un cop l’usuari tanqui el
                      navegador, totes les cookies de sessió es suprimiran
                      automàticament.
                    </li>
                  </ul>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="controlcookies"></span>
                  <h2>Control de cookies</h2>
                  <p>
                    Si l’usuari vol eliminar les cookies que hi ha al seu equip
                    o dispositiu, haurà de consulta les instruccions del seu
                    programari de gestió de fitxers per localitzar el fitxer o
                    el director que emmagatzem ales cookies.
                  </p>
                  <p>
                    Si l’usuari no està d’acord amb l’ús d’aquestes cookies,
                    Escapadesenparella.cat recomana desactivar-les consultant
                    les instruccions del fabricant del navegador fent clic a
                    “Ajuda” al menú del navegador. L’usuari haurà de tenir en
                    compte que en suprimir les cookies d’Escapadesenparella.cat
                    o inhabilitar les cookies futures, és possible que no pugui
                    accedir a determinades àrees o funcionals del nostre lloc
                    web.
                  </p>
                  <p>
                    Després de la visita de l’usuari al lloc web,
                    Escapadesenparella.cat pot canviar les cookies que utilitza.
                    Aquesta política de cookies sempre permetrà a l’usuari saber
                    qui col·loca cookies, amb quina finalitat i li proporcionarà
                    els mitjans per desactivar-les, de manera que haurà de
                    comprovar-la de tant en tant.
                  </p>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="quinescookiesutilitzem"></span>
                  <h2>Quines cookies utilitza Escapadesenparella.cat?</h2>
                  <p>
                    Les cookies pertanyen a una o més de les categories que es
                    detallen a continuació. El lloc web utilitza cookies que
                    pertanyen a totes les categories que s’indiquen a
                    continuació:
                  </p>
                  <ul>
                    <li>
                      <b>Essencials:</b> Gestor d’etiquetes de Google
                    </li>
                    <li>
                      <b>Estadístiques:</b> Google Analytics; Hotjar
                    </li>
                    <li>
                      <b>Interacció amb el client:</b> UserLike
                    </li>
                    <li>
                      <b>Publicitat:</b> Google AdSense
                    </li>
                  </ul>
                </section>
                <section className="legal-terms-block">
                  <span className="anchor" id="cookiestercers"></span>
                  <h2>Política de cookies de tercers</h2>
                  <p>
                    L’usuari ha de tenir en compte que aquesta política de
                    cookies no s’aplica, i Escapadesenparella.cat no es
                    responsabilitza, de les pràctiques de privadesa de llocs web
                    de tercers que poden estar enllaçats amb aquest lloc web.
                  </p>
                  <p>
                    Finalment, Escapadesenparella.cat recomana a l’usuari
                    visitar també la nostra secció de Termes i Condicions d’Ús
                    que regula l’ús del nostre lloc web.
                  </p>
                </section>
              </div>
            </div>
          </Container>
        </article>
      </main>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
      />
    </>
  );
};

export default PoliticaPrivadesa;
