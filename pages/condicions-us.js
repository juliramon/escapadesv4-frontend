import Head from "next/head";
import { useContext } from "react";
import Footer from "../components/global/Footer";
import NavigationBar from "../components/global/NavigationBar";
import UserContext from "../contexts/UserContext";

const CondicionsUs = () => {
  const { user } = useContext(UserContext);
  return (
    <>
      <Head>
        <title>Condicions d'ús – Escapadesenparella.cat</title>
      </Head>
      <NavigationBar
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
        user={user}
      />
      <main className="legal-terms py-12 w-full xl:w-8/12 mx-auto">
        <div className="container">
          <div className="flex flex-wrap items-start">
            <aside className="w-full md:w-1/4 relative md:sticky md:top-36 pr-12">
              <ul className="list-none m-0 p-0">
                <li className="pb-2 m-0">Dreceres</li>
                <li className="pb-2 m-0">
                  <a
                    href="#termescondicions"
                    title="Termes i condicions"
                    rel="nofollow"
                  >
                    Termes i condicions
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#sobreserveis"
                    title="Sobre els serveis"
                    rel="nofollow"
                  >
                    Sobre els serveis
                  </a>
                  <ul className="list-none mb-0 mt-4 opacity-60">
                    <li className="pb-2 m-0">
                      <a
                        href="#normesserveis"
                        title="Normes de serveis"
                        rel="nofollow"
                      >
                        Normes de serveis
                      </a>
                    </li>
                    <li className="pb-2 m-0">
                      <a
                        href="#contractacioserveis"
                        title="Contraactació dels serveis"
                        rel="nofollow"
                      >
                        Contraactació dels serveis
                      </a>
                    </li>
                    <li className="pb-2 m-0">
                      <a href="#durada" title="Durada" rel="nofollow">
                        Durada
                      </a>
                    </li>
                    <li className="pb-2 m-0">
                      <a
                        href="#ogligacions"
                        title="Obligacions i conducta de l'usuari"
                        rel="nofollow"
                      >
                        Obligacions i conducta de l'usuari
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="pb-2 m-0">
                  <a href="#accesweb" title="Accés al lloc web" rel="nofollow">
                    Accés al lloc web
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#comptes"
                    title="Comptes i inscripcions"
                    rel="nofollow"
                  >
                    Comptes i inscripcions
                  </a>
                  <ul className="list-none mb-0 mt-4 opacity-60">
                    <li className="pb-2 m-0">
                      <a
                        href="#condicionscompra"
                        title="Condicions de compra"
                        rel="nofollow"
                      >
                        Condicions de compra
                      </a>
                    </li>
                    <li className="pb-2 m-0">
                      <a
                        href="#retiradadevolucio"
                        title="Retirada i devolució"
                        rel="nofollow"
                      >
                        Retirada i devolució
                      </a>
                    </li>
                  </ul>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#politicacookies"
                    title="Política de cookies"
                    rel="nofollow"
                  >
                    Política de cookies
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#propietatindustrial"
                    title="Propietat industrial i intel·lectual"
                    rel="nofollow"
                  >
                    Propietat industrial i intel·lectual
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#exempcioresponsabilitat"
                    title="Exempció de responsabilitat"
                    rel="nofollow"
                  >
                    Exempció de responsabilitat
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#confidencialitat"
                    title="Confidencialitat"
                    rel="nofollow"
                  >
                    Confidencialitat
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#lleiaplicable"
                    title="Llei aplicable i jurisdicció"
                    rel="nofollow"
                  >
                    Llei aplicable i jurisdicció
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a
                    href="#politicaprivacitat"
                    title="Política de privadesa"
                    rel="nofollow"
                  >
                    Política de privadesa
                  </a>
                </li>
                <li className="pb-2 m-0">
                  <a href="#propietat" title="Propietat" rel="nofollow">
                    Propietat
                  </a>
                </li>
              </ul>
            </aside>
            <article className="w-full md:w-3/4">
              <section className="legal-terms-title-area">
                <h1>Condicions d'ús</h1>
                <div className="legal-terms-sub-h1">
                  <p className="text-xl mt-4 mb-0">
                    Condicions d’ús pel lloc web <u>Escapadesenparella.cat</u>
                  </p>
                  <p className="mt-1">Darrera actualització el 20/04/2021</p>
                </div>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="termescondicions"></span>
                <h2>1. Termes i condicions</h2>
                <p>
                  Aquestes disposicions regeixen el lloc web
                  www.escapadesenparella.cat i el seu ús. Aquest lloc web és
                  propietat d’Andrea Prat Pons, amb NIF 45127832-S (en endavant
                  “Escapadesenparella.cat”, “nosaltres” o el seu propi nom) i
                  s’ha posat a Internet a disposició dels seus clients. A més,
                  aquestes Condicions d’ús regeixen els termes i condicions (en
                  endavant “Termes” o “Condicions generals” de la prestació de
                  serveis tal com es descriu en aquell lloc web (en endavant “el
                  lloc web”).
                </p>
                <p>
                  En accedir o utilitzar el lloc web, l’usuari és considerat com
                  un “l’usuari” o “el client” i accepta estar obligat per
                  aquestes Condicions generals.
                </p>
                <p>
                  En acordar estar obligat per aquestes Condicions, l’usuari
                  reconeix el següent:
                </p>
                <ul>
                  <li>
                    L’usuari ha llegit, entès i acordat els termes aquí exposats
                  </li>
                  <li>
                    L’usuari és major d’edat [18 anys] i té la capacitat legal
                    suficient per utilitzar els serveis disponibles. Queda
                    totalment prohibit l’ús, registre o accés als serveis als
                    menors d’edat
                  </li>
                  <li>
                    L’usuari assumeix totes les obligacions aquí exposades
                  </li>
                </ul>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="sobreserveis"></span>
                <h2>2. Sobre els serveis</h2>
                <p>
                  L’ús dels serveis oferts al lloc web és un servei exclusiu per
                  a clients actius registrats d’Escapadesenparella.cat, cas per
                  cas. Un client s’activa quan es registra segons els
                  procediments establerts en aquest lloc web en cada cas
                  concret. En alguns casos, és possible que el client hagi de
                  confirmar el registre mitjançant el correu electrònic enviat
                  per Escapadesenparella.cat a l’adreça de correu electrònica
                  que l’usuari hagi proporcionat durant el procés de
                  subscripció.
                </p>
                <p>
                  L’ús d’aquest lloc web qualifica un client com a tal i implica
                  l’acceptació de tots els termes i condicions aquí inclosos. La
                  prestació del servei del lloc web es limita al temps que un
                  client està connectat al lloc web o a qualsevol dels serveis
                  disponibles a través del lloc web. En conseqüència, el client
                  hauria de llegir atentament aquestes Condicions d’ús cada
                  vegada que tingui intenció d’utilitzar aquest lloc web, ja que
                  tant el lloc web com aquestes Condicions d’ús poden estar
                  subjectes a canvis.
                </p>
                <p>
                  Els serveis d’Escapadesenparella.cat estan concebuts com una
                  plataforma o suite que funciona oferint els diferents serveis
                  de la plataforma. En aquest conjunt de serveis, el client pot
                  trobar diferents tipus de comptes com ara comptes d’usuari o
                  comptes d’organització. Mitjançant la selecció d’un d’aquests
                  tipus de compte, l’usuari podrà tenir una millor navegació i
                  experiència d’usuari; és possible que pugui ser reconegut per
                  altres usuaris; ser seguit per altres usuaris; obtenir
                  resultats personalitzats segons la configuració del seu
                  compte; obtenir suggeriments basats en les preferències del
                  seu perfil d’usuari; tenir més visibilitat a través de la
                  plataforma; i és possible que altres usuaris puguin
                  contactar-lo mitjançant el xat intern o la informació de
                  contacte habilitada, si és el cas.
                </p>
                <p>
                  Si l’usuari vol obtenir més informació sobre els serveis
                  d’Escapadesenparella.cat, li suggerim consultar la nostra
                  secció “Com funciona”.
                </p>
                <span className="anchor" id="normesserveis"></span>
                <h3>2.1 Normes de serveis</h3>
                <p>
                  Els usuaris es defineixen com a persones físiques, empreses i
                  organitzacions.
                </p>
                <p>
                  En cas que un client no compleixi les obligacions establertes
                  en aquesta plataforma, Escapadesenparella.cat es reserva el
                  dret de prohibir o denegar a aquest client l’ús dels serveis
                  del lloc web www.escapadesenparella.cat que s’hi ofereixen.
                </p>
                <p>
                  Alguns serveis del lloc web disponibles per als usuaris
                  d’Internet o per a l’ús exclusiu dels clients
                  d’Escapadesenparella.cat poden estar subjectes a condicions
                  addicionals que puguin complementar aquestes Condicions d’ús i
                  que el client hauria d’acceptar abans de prestar i/o
                  contractar el servei pertinent. L’accés i/o ús i/o interacció
                  d’aquests serveis i continguts indica l’acceptació plena i
                  incondicional de les condicions addicionals pertinents en el
                  moment en què es produeixi aquest accés i/o ús i/o interacció.
                </p>
                <p>
                  Escapadesenparella.cat es reserva el dret de canviar
                  unilateralment, en qualsevol moment i sense previ avís, el
                  formulari i les condicions de subscripció i compromís de
                  qualsevol servei d’Escapadesenparella.cat, inclòs al lloc web
                  www.escapadesenparella.cat, així com aquestes Condicions d‘ús
                  i qualsevol altra condició addicional pertinent.
                </p>
                <p>
                  En qualsevol cas, Escapadesenparella.cat notificarà a l’usuari
                  que hagi contractat un servei, qualsevol canvi substancial
                  realitzat a les Condicions d’ús o als seus serveis. En aquests
                  casos, l’usuari tindrà un termini de 30 dies per notificar a
                  Escapadesenparella.cat la seva decisió de posar fi als serveis
                  afectats. En cas contrari, s’entén que l’usuari accepta els
                  canvis.
                </p>
                <p>
                  Si Escapadesenparella.cat i l’usuari haguessin signat un acord
                  escrit específic que modifiqués algun aspecte d’aquestes
                  Condicions d’ús, aquest acord prevaldrà sobre les disposicions
                  d’aquestes Condicions esmentades.
                </p>
                <p>En utilitzat els nostres serveis, accepteu que:</p>
                <ul>
                  <li>
                    Totes les dades personals que proporcioneu són exactes i
                    actualitzades. Consentiu lliurement compartir les vostres
                    dades personals sota la vostra responsabilitat específica.
                  </li>
                  <li>
                    Aquest servei està dirigit exclusivament a usuaris majors
                    d’edat [18 anys]. Queda totalment prohibit qualsevol ús,
                    registra o accés als serveis a usuaris menors d’edat.
                  </li>
                  <li>
                    Escapadesenparella.cat es reserva el dret de posar-se en
                    contacte amb l’usuari a través del correu electrònic
                    proporcionat inicialment, o a través d’altres mitjans
                    relacionats amb el seu compte.
                  </li>
                  <li>
                    La infracció d’alguns d’aquestes Termes i Condicions pot
                    comportar la finalització directa del compte i subscripció
                    de l’usuari.
                  </li>
                </ul>
                <span className="anchor" id="contractacioserveis"></span>
                <h3>2.2 Contractació dels serveis</h3>
                <p>
                  L’accés, el procés de contractació i els termes i condicions
                  relatius a la prestació de serveis per part
                  d’Escapadesenparella.cat estaran subjectes al que s’estableixi
                  en cada ocasió al lloc web de l’empresa, vigent en el moment
                  en què es prestin aquests serveis. En conseqüència,
                  Escapadesenparella.cat es reserva el dret de canviar
                  unilateralment, en qualsevol moment i sense previ avís,
                  aquests termes i condicions.
                </p>
                <p>
                  A més, en contractar la presentació de serveis per part
                  d’Escapadesenparella.cat, el client es compromet expressament
                  a subministrar informació veritable sobre ell mateix amb
                  aquest propòsit, assumint qualsevol dany o perjudici de
                  qualsevol tipus derivat de la falsedat de la informació
                  proporcionada per ell, que afecti directament i/o
                  indirectament a Escapadesenparella.cat i/o qualsevol tercer,
                  en qualsevol moment, per qualsevol motiu, per qualsevol mitjà
                  i/o de qualsevol manera.
                </p>
                <span className="anchor" id="durada"></span>
                <h3>2.3 Durada</h3>
                <p>
                  Segons els termes i condicions d’aquestes Condicions d’ús i de
                  les condicions addicionals pertinents, Escapadesenparella.cat
                  es reserva el dret unilateral de suspendre temporalment o
                  finalitzar definitivament la prestació de serveis a través del
                  lloc web www.escapadesenparella.cat, així com de suspendre
                  temporalment o definitivament el servei del lloc web
                  www.escapadesenparella.cat.
                </p>
                <p>
                  De la mateixa manera, el client sap i accepta que
                  Escapadesenparella.cat pot publicar les fitxes d’activitat,
                  les fitxes d’allotjament, el perfil d’usuari i el perfil
                  d’organització a qualsevol xarxa social o en qualsevol altre
                  lloc web propietat d’Escapadesenparella.cat o de tercers.
                  Escapadesenparella.cat no tindrà cap responsabilitat de cap
                  tipus per a aquestes publicacions.
                </p>
                <p>
                  La publicació de les fitxes d’activitat, les fitxes
                  d’allotjament, el perfil d’usuari i el perfil d’organització
                  en aquestes xarxes socials i/o llocs web permeten la seva
                  visualització pel públic en general.
                </p>
                <p>
                  Els motors de cerca d’Internet indexaran el perfil d’usuari i
                  el perfil d’organització dels usuaris de manera
                  predeterminada.
                </p>
                <span className="anchor" id="obligacions"></span>
                <h3>2.4 Obligacions i conducta de l’usuari</h3>
                <p>
                  L’usuari es compromet a utilitzar els serveis d’acord amb la
                  legislació aplicable, els principis morals i l’ordre públic,
                  així com aquestes Condicions generals.
                </p>
                <p>
                  L’usuari no utilitzarà el lloc web per a activitats il·legals
                  ni activitats que es puguin considera delictes contra els
                  drets de tercers o que infringeixin qualsevol llei aplicable.
                </p>
                <p>
                  L’usuari és l’únic responsable de totes les activitats del seu
                  compte i de tot el contingut que es penja i/o es crea sota el
                  seu compte. La subscripció de l’usuari, inclosos el seu correu
                  electrònic i la seva contrasenya, són personals i no poden ser
                  transferits ni utilitzats per ningú més.
                  Escapadesenparella.cat proporcionarà al client la possibilitat
                  de tenir un correu electrònic i una contrasenya de caràcter
                  personal i intransferible, per a l’ús d’aquest lloc web o dels
                  serveis oferts per Escapadesenparella.cat. Els clients que es
                  comprometen a mantenir confidencials el seu correu electrònic
                  i contrasenya, i a no permetre l’ús dels mateix per part de
                  tercers, assumint la responsabilitat de les conseqüències
                  derivades de la infracció d’aquesta obligació. Les
                  contrasenyes es poden canviar a petició de qualsevol de les
                  parts. En cas que Escapadesenparella.cat sol·liciti
                  expressament aquest canvi, es notificarà als clients la data
                  en què es desactivarà aquesta contrasenya i se substituirà per
                  una de nova.
                </p>
                <p>
                  Escapadesenparella.cat no es fa responsable de cap manera de
                  la pèrdua o danys derivats de l’accés no autoritzat al compte
                  del client o de l’ús de les seves dades d’inici de sessió. Si
                  el client coneix o sospita que hi ha un ús no autoritzat del
                  seu compte, haurà de notificar-ho immediatament a
                  Escapadesenparella.cat. Les dades de contacte es troben al
                  final d’aquest document. El client no podrà contribuir, enviar
                  ni difondre cap opinió de propaganda, religiosa i/o política,
                  ni informació que es pugui considerar racista, xenòfoba,
                  pornogràfica, que doni suport al terrorisme o que infringeixi
                  els drets humans. A més, el client no podrà difamar, assetjar
                  ni ofendre altres persones mitjançant l’ús dels nostres
                  serveis. Si teniu crítiques o comentaris sobre
                  Escapadesenparella.cat o els nostres serveis, primer poseu-vos
                  en contacte amb nosaltres per ajudar-nos a millorar els
                  nostres serveis.
                </p>
                <p>
                  El client no pot transmetre ni distribuir fitxes que puguin
                  danyar els sistemes informàtics d’Escapadesenparella.cat, del
                  proveïdor de serveis d’Internet o d’usuaris d’Internet de
                  tercers (com ara virus o programari maliciós). No pot
                  difondre, transmetre ni proporcionar a les seves parts cap
                  tipus d’informació, element o contingut que pugui constituir
                  una vulneració dels drets fonamentals i de les llibertats
                  civils. Tampoc no pot difondre, transmetre ni proporcionar cap
                  tipus d’informació, element o contingut que pugui constituir
                  publicitat il·lícita o injusta.
                </p>
                <p>
                  El client no pot difondre, transmetre ni proporcionar a
                  tercers cap tipus d’informació, element o contingut que es
                  pugui considerar una violació de les lleis de privadesa o de
                  protecció de dades.
                </p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="accesweb"></span>
                <h2>3. Accés al lloc web</h2>
                <p>
                  L’accés al lloc web és gratuït, excepte pel que fa al cost del
                  servei de telecomunicacions subministrat pel proveïdor de
                  l’usuari.
                </p>
                <p>
                  Tots els clients han d’accedir i utilitzar el lloc web
                  www.escapadesenparella.cat segons aquests Termes, condicions
                  addicionals, la llei, l’ètica, les convencions morals i/o de
                  bona fe, i s’abstindran de realitzar qualsevol acte de
                  qualsevol tipus que puguin tenir un efecte advers al lloc web,
                  Escapadesenparella.cat i/o qualsevol altre client dels
                  mateixos i/o tercers.
                </p>
                <p>
                  Els serveis poden contenir enllaços, directoris i motors de
                  cerca que permetin a l’usuari accedir a altres llocs web i
                  portals (“llocs enllaçats”). En aquests casos,
                  Escapadesenparella.cat només serà responsable del contingut
                  i/o serveis subministrats als llocs enllaçats quan tingui
                  coneixement efectiu d’alguna activitat il·legal i no
                  procedeixi a eliminar l’enllaç amb la deguda diligència. Si
                  l’usuari considera que un lloc enllaçat conté contingut
                  il·lícit o inadequat, pot i haurà de notificar a
                  Escapadesenparella.cat aquesta circumstància. En cap cas,
                  aquesta comunicació obligarà Escapadesenparella.cat a eliminar
                  l’enllaç corresponent. La inclusió de llocs enllaçats al lloc
                  web no implica que s’establissin acords entre
                  Escapadesenparella.cat i els propietaris dels llocs enllaçats
                  ni implica que Escapadesenparella.cat recomani o doni suport
                  als esmentats llocs enllaçats i/o al seu contingut.
                </p>
                <p>
                  Tret que s’indiqui el contrari al lloc, Escapadesenparella.cat
                  desconeix el contingut i els serveis dels llocs enllaçats. Per
                  tant, Escapadesenparella.cat no es fa responsable de cap
                  pèrdua o dany causat a l’usuari o a tercers per la naturalesa
                  il·legal, la qualitat, l’actualització, la indisponiblitat,
                  l’error o la futilitat dels llocs enllaçats.
                </p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="comptes"></span>
                <h2>4. Comptes i inscripcions</h2>
                <p>
                  Amb subjecció als termes i condicions dels mateixos, durant el
                  període de vigència d’aquestes Condicions, l’empresa permetrà
                  a l’usuari utilitzar els serveis de manera no exclusiva.
                  L’empresa pot canviar, modificar o actualitzar els serveis en
                  qualsevol moment sense previ avís, inclòs per eliminar una
                  funcionalitat. Actualment, l’empresa posa a la disposició de
                  l’usuari determinades funcions dels serveis. L’usuari pot
                  registrar-se per utilitzar els serveis de l’empresa
                  proporcionant la informació sol·licitada o iniciant sessió a
                  través d’un compte de xarxes socials i/o mitjançant una
                  aplicació d’estils de vida/seguiment d’informació (“Aplicació
                  de tercers”).
                </p>
                <p>
                  L’empresa podrà canviar el mètode de registre o inici de
                  sessió, inclosos els tipus de comptes i els serveis prestats a
                  través d’ells, a la seva discreció. En registrar-se a través
                  d’un compte de xarxes socials i/o a través d’una aplicació de
                  tercers, l’usuari declara i garanteix que aquest compte és seu
                  i ha donat accés a l’empresa, proporcionant la informació
                  d’aquest compte. L’empresa es reserva el dret de rebutjar
                  serveis a qualsevol usuari que obri un compte per qualsevol
                  motiu, a la seva exclusiva discreció. L’usuari accepta que
                  proporcionarà a l’empresa informació precisa i completa en la
                  creació del seu compte i en l’ús dels serveis, i que
                  actualitzarà aquesta informació immediatament després que
                  canviï. L’usuari tindrà tota la responsabilitat de qualsevol
                  inexactitud de la informació que proporcioni a l’empresa o de
                  no mantenir aquesta informació actualitzada.
                </p>
                <p>
                  Es demana a l’usuari que no comparteixi el seu compte ni la
                  seva informació d’inici de sessió amb cap tercer, ni permeti
                  que cap tercer accedeixi al seu compte, sent l’únic
                  responsable de mantenir la confidencialitat de la informació
                  d’inici de sessió al seu compte. L’usuari és l’únic
                  responsable de la seguretat del sistema informàtic, del
                  dispositiu mòbil i de tota l’activitat del seu compte.
                  L’empresa no es farà responsable de cap pèrdua o dany derivat
                  de l’ús no autoritzat dels serveis. L’usuari accepta protegir
                  i no perjudicar a l’empresa pel que fa a l’ús indegut o
                  il·legal dels serveis, així com els càrrecs i impostos
                  incorreguts.
                </p>
                <p>
                  Un cop el client creï el seu compte, caldrà emplenar tots els
                  camps obligatoris per complir les finalitats previstes pels
                  serveis.
                </p>
                <p>
                  Si l’usuari vol obtenir més informació sobre com unir-se i
                  obtenir un compte dels serveis d’Escapadesenparella.cat,
                  recomanem consultar a nostra secció “Començar”.
                </p>
                <span className="anchor" id="condicionscompra"></span>
                <h3>4.1 Condicions de compra</h3>
                <p>
                  El servei té accés gratuït per a tothom un cop registrats.
                  Dins de la plataforma, l’usuari pot interactuar amb diferents
                  tipus de comptes i continguts, i triar adquirir un servei
                  superior de pagament de la seva preferència. Si l’usuari té
                  intenció de conèixer més informació sobre els comptes actuals,
                  recomanem consultar la nostra secció “Plans i preus”, fent
                  clic als següents enllaços:
                </p>
                <ul>
                  <li>
                    Actualment l’empresa no té la secció de “Plans i preus”
                    habilitada. Tan bon punt la o les seccions estiguin
                    disponibles s’enllaçaran en aquest apartat.
                  </li>
                </ul>
                <p>
                  Escapadesenparella.cat accepta els següents mètodes de
                  pagament:
                </p>
                <ul>
                  <li>American Express</li>
                  <li>MasterCard</li>
                  <li>Visa</li>
                  <li>PayPal</li>
                </ul>
                <p>Temporalment, no s’accepten altres formes de pagament.</p>
                <span className="anchor" id="retiradadevolucio"></span>
                <h3>4.2 Retirada i devolució</h3>
                <p>
                  Escapadesenparella.cat reemborsarà a l’usuari l’import total
                  pagat en cas que l’usuari finalitzi l’ús del servei en un
                  termini de 14 dies des de la seva compra. Mentrestant, durant
                  aquest període, l’usuari pot exercir el dret de desistiment.
                </p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="politicacookies"></span>
                <h2>5. Política de cookies</h2>
                <p>
                  Per obtenir més informació sobre la nostra política de
                  cookies, recomanem a l’usuari consultar la nostra secció
                  “Política de cookies”.
                </p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="propietatindustrial"></span>
                <h2>6. Propietat industrial i intel·lectual</h2>
                <p>
                  Escapadesenparella.cat, propietat d’Andrea Prat Pons, amb NIF
                  45127832-S, és el propietari del nom de domini
                  www.escapadesenparella.cat.
                </p>
                <p>
                  Tot el lloc web www.escapadesenparella.cat, incloent, sense
                  limitacions, el seu disseny, estructura i distribució, textos
                  i continguts, logotips, botons, imatges, codi font, així com
                  tots els seus drets de propietat industrial i intel·lectual i
                  qualsevol altre signe distintiu relacionat, al propi lloc web,
                  així com a qualsevol altra cosa que hi aparegui, i a tot allò
                  referent als serveis prestats per Escapadesenparella.cat i/o
                  que Escapadesenparella.cat posseeixi, pertanyen a
                  Escapadesenparella.cat i/o al propietari pertinent. En
                  conseqüència, l’ús, l’explotació, la còpia, la reproducció,
                  així com l’eliminació, lesió, alteració i/o modificació,
                  registra i/o sol·licitud de registre dels mateixos i/o
                  qualsevol altra cosa similar, present i/o futura, està
                  prohibit per qualsevol mitjà i/o forma, total o parcial,
                  temporal o definitiu, sense autorització expressa i per escrit
                  d’Escapadesenparella.cat i/o del propietari pertinent. No
                  s’entendrà en cap moment que Escapadesenparella.cat i/o el
                  propietari pertinent hagi concedit cap permís o autorització
                  de cap tipus, ja sigui totalment o parcialment, a tercers i/o
                  clients.
                </p>
                <p>
                  Escapadesenparella.cat es reserva el dret de redissenyar i
                  canviar unilateralment, en qualsevol moment i sense previ
                  avís, la presentació i configuració del lloc web
                  www.escapadesenparella.cat.
                </p>
                <p>
                  Tots els drets de propietat industrial i intel·lectual i
                  qualsevol altre signe distintiu, inclosos, sense limitacions,
                  continguts, documents, textos i resums publicats en aquest
                  lloc web, així com imatges, dissenys, gràfics, dibuixos,
                  botons, logotips i/o marques de diferents col·laboradors del
                  lloc web pertanyen als seus autors. En conseqüència, l’ús,
                  explotació, còpia, reproducció, així com l’eliminació, dany,
                  alteració i/o modificació, registre i/o sol·licitud de
                  registre dels mateixos i/o qualsevol altra cosa similar,
                  present i/o futura, està prohibit per qualsevol mitjà i/o
                  forma, total o parcial, temporal o definitiu, sense
                  l’autorització expressa dels autors. No s’entendrà en cap
                  moment que s’hagi concedit cap permís o autorització de cap
                  tipus, total o parcial, a tercers i/o clients per part dels
                  autors.
                </p>
                <p>
                  Escapadesenparella.cat no assumeix cap responsabilitat en cas
                  que un tercer i/o clients infringeixin qualsevol dret de
                  propietat industrial o intel·lectual de tercers o que
                  infringeixin els drets de tercers i/o clients.
                </p>
                <p>
                  Relatiu a tota la informació transmesa a través de la
                  plataforma, sigui quin sigui el mitjà o canal, l’usuari que
                  envia la informació afirma que posseeix els drets i/o la
                  capacitat legal necessaris per dur a terme aquesta acció, no
                  vulnerant cap dret, en particular, els drets exclusius, els
                  drets de propietat intel·lectual i/o industrial i/o acords de
                  confidencialitat signats amb tercers.
                </p>
                <p>
                  En cas d’incompliment de qualsevol de les obligacions
                  anteriors, l’usuari que envia la informació està obligat a
                  alliberar completament Escapadesenparella.cat de qualsevol
                  reclamació (incloses les despeses raonables d’advocat i
                  sol·licitant), multa, multa o pena que puguin imposar a causa
                  del resultat del cas. De la mateixa manera,
                  Escapadesenparella.cat no assumirà cap responsabilitat per
                  l’ús que l’usuari o organització final pugui fer de la
                  informació rebuda. L’usuari sap i accepta que el simple
                  enviament d’informació no obliga a Escapadesenparella.cat ni a
                  l’usuari o organització final a la mateixa obligació de
                  tractar la informació com a confidencial i, un cop en el seu
                  poder, l’empresa final pot conservar i utilitzar la informació
                  tramesa lliurement encara que no s’arribi a una relació
                  comercial formal i/o contracte posterior entre l’usuari i
                  l’usuari o empresa final.
                </p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="exempcioresponsabilitat"></span>
                <h2>7. Exempció de responsabilitat</h2>
                <p>
                  No hi ha cap relació o connexió de cap tipus entre
                  Escapadesenparella.cat i el lloc web
                  www.escapadesenparella.cat i els propietaris d’altres llocs
                  web als quals estan vinculats, si n’hi ha. En conseqüència,
                  Escapadesenparella.cat i el lloc web
                  www.escapadesenparella.cat no es fan responsables d’altres
                  llocs web, ni de la seva utilitat, fiabilitat, precisió ni
                  dels continguts que s’hi inclouen. Es tracta, per tant, de
                  llocs web que pertanyen a empreses independents que no tenen
                  cap connexió ni relació entre elles.
                </p>
                <p>
                  Escapadesenparella.cat no es fa responsable dels danys i/o
                  perjudicis i/o pèrdues d’ingressos per part de qualsevol
                  client o tercers afectats negativament com a conseqüència de
                  les opinions, representacions, dades i/o continguts, si n’hi
                  ha, que els clients i/o terceres parts poden mostrar
                  directament o indirectament per qualsevol motiu, en qualsevol
                  moment i de qualsevol manera, al lloc web
                  www.escapadesenparella.cat.
                </p>
                <p>
                  Escapadesenparella.cat no garanteix que el lloc web
                  www.escapadesenparella.cat funcioni constantment, de forma
                  fiable i permanent, sense retards ni interrupcions. En
                  conseqüència, Escapadesenparella.cat no es fa responsable dels
                  danys i/o perjudicis i/o pèrdues d’ingressos per part de
                  qualsevol client o tercer afectat negativament com a
                  conseqüència d’aquest.
                </p>
                <p>
                  Escapadesenparella.cat no es fa responsable dels danys i/o
                  perjudicis i/o pèrdues d’ingressos per part de qualsevol
                  client o tercer afectat negativament com a conseqüència d’un
                  esdeveniment de força major, acte de Déu, fallada o error en
                  les línies de comunicació o de servei defectuós d’Internet, o
                  connexió defectuosa.
                </p>
                <p>
                  Escapadesenparella.cat no es fa responsable dels danys i/o
                  perjudicis ocasionats a cap client o tercers ni dels danys i
                  perjudicis suportats per qualsevol client o tercers
                  directament o indirectament derivats de l’ús i/o accés i/o
                  connexió al lloc web www.escapadesenparella.cat i/o llocs
                  vinculats a aquest. En conseqüència, Escapadesenparella.cat no
                  serà responsable de cap dany o perjudici per a cap client o
                  tercer ni per cap pèrdua d’ingressos per part de cap client o
                  tercer com a conseqüència del mal funcionament, defectes,
                  fallades o danys, total o parcial, a maquinari, programari i/o
                  programes d’ordinador, així com la pèrdua/alteració i/o
                  d’anys, total o parcial, de la informació continguda en
                  dispositius d’emmagatzematge magnètic, discos, cintes,
                  disquets i altres suports, com així per a la introducció de
                  virus informàtics o qualsevol variació o alteració no
                  desitjada en tota la informació, documents, fitxers, bases de
                  dades maquinari i/o programari.{" "}
                </p>
                <p>
                  Escapadesenparella.cat no es fa responsable dels danys i/o
                  perjudicis ocasionats a tercers per l’ús de les dades
                  bancàries sense el seu consentiment per part de qualsevol
                  client que contracti qualsevol servei
                  d’Escapadesenparella.cat.
                </p>
                <p>
                  Escapadesenparella.cat no serà responsable de cap dany i/o
                  perjudici per a cap client que no sigui únicament, directament
                  i exclusivament atribuïble a l’empresa, quan el client i/o
                  qualsevol tercer o les persones a responsables en siguin
                  responsables.{" "}
                </p>
                <p>
                  Escapadesenparella.cat no serà responsable de cap fallada en
                  les comunicacions, inclosa la supressió, transmissió
                  incompleta o lliurament retardat, i no es compromet, a més, a
                  garantir que la xarxa de transmissió sempre estigui operativa.
                  A més, Escapadesenparella.cat no es farà responsable en cas
                  que un tercer (incloses les xarxes socials) incompleixi les
                  mesures de seguretat establertes per Escapadesenparella.cat
                  i/o circuli i/o transmeti virus informàtics.
                </p>
                <p>
                  Escapadesenparella.cat ha adoptat totes les mesures de
                  seguretat requerides legalment per protegir les dades
                  personals facilitades pels clients. Malgrat l’anterior,
                  Escapadesenparella.cat no pot assegurar la invulnerabilitat
                  absoluta dels seus sistemes de seguretat ni la seguretat o
                  inviolabilitat d’aquestes dades durant la transmissió a través
                  de la xarxa. A més, Escapadesenparella.cat no garanteix la
                  veracitat o fiabilitat de la informació facilitada pels
                  clients.
                </p>
                <p>
                  Escapadesenparella.cat no controla ni garanteix l'eficàcia
                  dels serveis ni l'absència de virus informàtics dels serveis
                  prestats per tercers a través de la seva xarxa de portals que
                  puguin produir alteracions en el seu sistema d'informació
                  (programari i maquinari) o en els documents o fitxers
                  electrònics emmagatzemats en la seva informació sistema.
                </p>
                <p>
                  Els dispositius d’enllaç que Escapadesenparella.cat posa a
                  disposició dels clients tenen la finalitat de facilitar la
                  cerca d’informació disponible a Internet.
                  Escapadesenparella.cat no assegura que el servei sigui adequat
                  per realitzar cap servei que no sigui el contractat o que
                  permeti l'accés a tots els llocs d'Internet.
                  Escapadesenparella.cat no ofereix ni comercialitza productes i
                  serveis disponibles a través de llocs d’enllaços ni assumeix
                  cap responsabilitat per aquests productes o serveis.
                </p>
                <p>
                  Com a proveïdor de serveis, Escapadesenparella.cat no controla
                  l’ús que els clients fan dels seus serveis.
                  Escapadesenparella.cat no es fa responsable de l’ús i/o
                  continguts que els clients puguin fer infringint les lleis o
                  les presents Condicions d’ús i/o condicions addicionals
                  pertinents, en la mesura que Escapadesenparella.cat no es fa
                  responsable dels continguts i/o informació i dades que es
                  transmetin, ni origina la transmissió, ni modifica ni
                  selecciona les dades ni els destinataris. En conseqüència, el
                  client sol serà responsable de les conseqüències que poguessin
                  derivar-se d’un ús il·legal o contrari a aquestes condicions,
                  així com de la veracitat i/o licitud dels continguts mostrats
                  pel client. A aquest efecte, els clients utilitzaran els
                  serveis de conformitat amb la legislació vigent aplicable al
                  respecte.
                </p>
                <p>
                  En el cas que Escapadesenparella.cat sàpiga, per qualsevol
                  mitjà o forma, ja sigui directa o indirectament, de
                  l’existència de continguts que puguin infringir qualsevol llei
                  vigent o aquestes Condicions d’ús i/o condicions addicionals
                  pertinents o d’ús que es facin de manera fraudulenta, il·legal
                  i/o amb finalitats no autoritzades, Escapadesenparella.cat es
                  reserva el dret de suspendre, per si mateix, totalment o
                  parcialment, la prestació de serveis, sense l'autorització
                  prèvia del client, eliminant els continguts infractors o
                  prenent qualsevol altra mesura que consideri necessària per
                  evitar la subsistència de les infraccions o infraccions
                  detectades, i el client renuncia a qualsevol dret a reclamar o
                  exercir qualsevol dret, de qualsevol tipus, en cas que
                  Escapadesenparella.cat cometés un error i/o error directament
                  o indirectament en avaluar la situació anterior.
                </p>
                <p>
                  Malgrat l’anterior, Escapadesenparella.cat es reserva el dret
                  d’informar les autoritats administratives i judicials de
                  qualsevol esdeveniment que pugui constituir una activitat
                  il·legal, sense necessitat de previ avís al client.
                </p>
                <p>
                  Escapadesenparella.cat no es fa responsable de cap defecte o
                  interrupció en la prestació dels serveis que comercialitzi i
                  proporcioni i dels danys causats per aquests defectes o
                  interrupcions en la mesura que es donin les circumstàncies
                  següents:
                </p>
                <ul>
                  <li>
                    Interrupció del servei com a resultat de les operacions de
                    manteniment de la xarxa.
                  </li>
                  <li>
                    La manca de continuïtat del servei causada per la
                    introducció d’elements de maquinari o programari per part
                    del client i/o de tercers que provoca un mal funcionament
                    general dels seus equips informàtics o que té
                    incompatibilitats amb els elements necessaris en aquests
                    equips.
                  </li>
                  <li>
                    La interrupció del servei causada per la indisponiblitat
                    d’accés de banda ampla per donar suport a aquests serveis.
                  </li>
                  <li>
                    Interrupció del servei causada per un ús incorrecte o un
                    ajust inexacte d'aquests serveis.
                  </li>
                  <li>
                    Interrupció del servei produïda per la fallada del
                    subministrament elèctric dels equips i dispositius
                    utilitzats pel client per als serveis.
                  </li>
                  <li>
                    Causes atribuïbles a qualsevol tercer o per força major.
                  </li>
                  <li>
                    Reducció de la qualitat del servei o del flux de connexió
                    per motius que no s’atribueixen directament a
                    Escapadesenparella.cat.
                  </li>
                  <li>Decisions o ordres administratives o judicials.</li>
                  <li>
                    Configuració defectuosa de la instal·lació requerida pel
                    client i/o qualsevol altre tercer.
                  </li>
                  <li>
                    Danys i/o perjudicis no atribuïbles únicament, directa i
                    exclusivament a Escapadesenparella.cat.
                  </li>
                  <li>
                    Pèrdua d’ingressos per part del client i/o qualsevol altre
                    tercer.
                  </li>
                  <li>
                    Danys i perjudicis, de qualsevol tipus, produïts per
                    qualsevol motiu per culpa del client i/o de tercers.
                  </li>
                  <li>
                    Danys i/o perjudicis causats directa o indirectament al
                    Escapadesenparella.cat i/o qualsevol tercer per causes que
                    no siguin imputables directament o indirectament a
                    Escapadesenparella.cat.
                  </li>
                  <li>
                    Els esdeveniments imprevisibles, així com els esdeveniments
                    de força major, mesures oficials i fallades en les
                    connexions de telecomunicacions no atribuïbles directament a
                    Escapadesenparella.cat, exoneraran Escapadesenparella.cat de
                    la prestació de serveis mentre estiguin vigents.
                  </li>
                </ul>
                <p>
                  Finalment, pel que fa als usuaris o empreses que emplenin el
                  formulari de publicació d’activitat, o el formulari de
                  publicació d’allotjament que es troba en aquest lloc web,
                  hauran de fer-ho sota la seva responsabilitat exclusiva:
                </p>
                <ul>
                  <li>
                    Actuar de bona fe durant tot el procés de publicació, gestió
                    i interacció amb el contingut i els usuaris.
                  </li>
                  <li>
                    Mantenir Escapadesenparella.cat exempt en tots els casos,
                    reconeixent i assumint expressament la seva independència i
                    manca de connexió amb la relació comercial i/o contractual
                    que es pugui establir entre qualsevol tipus d’usuari i tal
                    empresa o empreses interessades.
                  </li>
                </ul>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="confidencialitat"></span>
                <h2>8. Confidencialitat</h2>
                <p>
                  Escapadesenparella.cat i els seus empleats i el personal del
                  servei tècnic intentaran mantenir confidencial tota la
                  informació del client a la qual se’ls doni accés per qualsevol
                  mitjà, i no utilitzaran, revelaran ni permetran que s’utilitzi
                  o es reveli. A petició del client, hauran de fer tot el
                  possible per destruir o retornar aquesta informació
                  immediatament en cas que es registri per qualsevol motiu i/o
                  per qualsevol mitjà, quan compleixin els serveis contractats i
                  d’acord amb els termes i condicions establerts en aquestes
                  Condicions d’ús i les condicions addicionals pertinents se’ls
                  dóna accés a la informació del client de qualsevol tipus. Les
                  lleis aplicables en aquest sentit regiran en tots aquests
                  casos.
                </p>
                <p>
                  El xat posat a disposició dels usuaris no s’ha d’utilitzar per
                  enviar informació que es consideri confidencial.
                  Escapadesenparella.cat no es fa responsable de les
                  conseqüències que poguessin derivar-se del incompliment
                  d’aquesta recomanació pels usuaris.
                </p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="lleiaplicable"></span>
                <h2>9. Llei aplicable i jurisdicció</h2>
                <p>
                  Les discrepàncies, reclamacions i controvèrsies que es puguin
                  presentar es presentaran als jutjats de la ciutat on es troba
                  el client.
                </p>
                <p>La llei espanyola serà la llei reguladora.</p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="politicaprivacitat"></span>
                <h2>10. Política de privacitat</h2>
                <p>
                  Per obtenir més informació sobre la Política de privacitat de
                  la plataforma, recomanem a l’usuari consultar la nostra
                  “Política de privacitat”.
                </p>
              </section>
              <section className="legal-terms__block">
                <span className="anchor" id="propietat"></span>
                <h2>11. Propietat</h2>
                <p>
                  Andrea Prat Pons, amb NIF 45127832-S, es propietària
                  d’Escapadesenparella.cat, de la plataforma
                  www.escapadesenparella.cat i dels serveis oferts a través
                  d’aquesta.
                </p>
              </section>
            </article>
          </div>
        </div>
      </main>
      <Footer
        logo_url={
          "https://res.cloudinary.com/juligoodie/image/upload/v1619634337/getaways-guru/static-files/logo-escapadesenparella-v4_hf0pr0.svg"
        }
      />
    </>
  );
};

export default CondicionsUs;
