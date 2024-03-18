
Conversation opened. 1 unread message.

Skip to content
Using Gmail with screen readers
Enable desktop notifications for Gmail.
   OK  No thanks
1 of 133
    + page.svelte
Inbox

Ayush Chalise < ayushchalise12@gmail.com>
    9:01 PM(0 minutes ago)
to me

    < script lang = "ts" >
    import { dev } from '$app/environment';
import { page } from '$app/stores';
import { DevisStates, DevisTypes } from '$libs/devis/devis';
import { createDevis } from '$libs/functions/devis-functions';
import { Spinner, Toast } from 'flowbite-svelte';
import moment from 'moment';
import { onMount } from 'svelte';
import { slide } from 'svelte/transition';
import { centralephotovoltaique } from '../../environments/environment-client';
import BasicSkeleton from '../../libs/components/skeleton/BasicSkeleton.svelte';
import Loading from '../../libs/components/spinner/LoadingSpinner.svelte';
import StepperHorizontal from '../../libs/components/stepper/StepperHorizontal.svelte';
import StepperHorizontalStep from '../../libs/components/stepper/StepperHorizontalStep.svelte';
import StepperVertical from '../../libs/components/stepper/StepperVertical.svelte';
import StepperVerticalStep from '../../libs/components/stepper/StepperVerticalStep.svelte';
import { FormResultType } from '../../libs/forms/form-result';
import { createFormResult, saveFormResult } from '../../libs/functions/form-page-functions';
import { uuid_e4 } from '../../libs/utils/utils';
import FormStep1 from './FormStep1.svelte';
import FormStep2 from './FormStep2.svelte';
import FormStep3 from './FormStep3.svelte';
import FormStep4 from './FormStep4.svelte';
import FormStep5 from './FormStep5.svelte';



let legalsShow: boolean = false;
let isToasted: boolean = false;

let progressiveSave: boolean | undefined = undefined;
let finalSave: boolean | undefined = undefined;

let isLoading = true;
let loadingText = 'Chargement....';

let currentStep = 0;
let values: Record<string, any> = {};

let session_id = uuid_e4();
let result_id: string | undefined = undefined;
let finalUrlDownloadPdf: string | undefined = undefined;

let toggleLegals = () => (legalsShow = !legalsShow);

const _searchParams: URLSearchParams = $page.url.searchParams;
if (_searchParams.has('s')) currentStep = 1;


onMount(async () => {
    let response: Response = await createFormResult(
        navigator,
        window,
        $page.url.origin,
        $page.url.href,
        'centrale-photovoltaique-v2',
        session_id,
        values
    );
    result_id = (await response.json())?.result_id;
    progressiveSave = !!result_id;

    // Check if the URL contains the "S" parameter
    const hasSParameter = _searchParams.has('s');

    if (hasSParameter) {
        // If the "S" parameter is present, send the email with predefined data
        await sendEmail();
    } else {
        // If the "S" parameter is not present, proceed with form completion logic
        console.error('Missing data for sending email. Waiting for form completion.');
    }

    isLoading = false;
    loadingText = '';
});


const sendEmail = async () => {
    try {
        const response = await fetch(origin + '/api/mail/send', {
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            body: JSON.stringify({
                result_id: result_id,
                to: values?.['souscripteur_email'] ?? 'ayushchalise12@gmail.com',
                from: centralephotovoltaique?.partner?.mail?.from,
                templateId: centralephotovoltaique?.partner?.mail?.templateId,
                subject: values?.['souscripteur_email']
                    ? centralephotovoltaique?.partner?.mail?.subject
                    : 'Error with `souscripteur_email`, your fallback mail as ready.',
                pdfUrl: finalUrlDownloadPdf,
                message: `name: 'Ayush', cast: 'Chalise'` // Include the provided message here
            })
        });

        if (response.ok) {
            console.log('Email sent successfully');
        } else {
            console.error('Failed to send email');
        }
    } catch (error) {
        console.error('Error sending email:', error);
    }
};



const onChange = async () => {
    if (!result_id) return;
    progressiveSave = undefined;
    let response: Response = await saveFormResult(
        $page.url.origin,
        'centrale-photovoltaique-v2',
        session_id,
        result_id,
        FormResultType.partial,
        values
    );
    progressiveSave = response.status === 201;
};
const onFinalSubmit = async () => {
    if (!result_id) return;
    isLoading = true;

    values['validite_offre'] = '3 mois';
    values['emise_le'] = moment(new Date()).format('DD/MM/YYYY');
    values['courtier'] = 'OASSURE';

    values['form_id'] = 'centrale-photovoltaique-v2';
    values['id'] = result_id;
    values['last_update'] = new Date().toISOString();

    let response: Response = await saveFormResult(
        $page.url.origin,
        'centrale-photovoltaique-v2',
        session_id,
        result_id,
        FormResultType.full,
        values
    );

    const finalSaveResultId = (await response.json()).result_id;
    finalUrlDownloadPdf = `${origin}/api/pdf/generate/centralephotovoltaique?result_id=${finalSaveResultId}`;
    finalSave = response.status === 201;
    isLoading = false;
    loadingText = '';

    finalSave = response.status === 201;
    isLoading = false;
    loadingText = '';

    // let raison_sociale = values['entreprise_raison_sociale'];
    let raison_sociale = values['entreprise_raison_sociale'];
    if (
        !raison_sociale &&
        values['souscripteur_civilite'] &&
        values['souscripteur_nom'] &&
        values['souscripteur_prenoms']
    )
        raison_sociale = `${values['souscripteur_civilite']} ${values['souscripteur_nom']} ${values['souscripteur_prenoms']}`;
    else if (!raison_sociale) raison_sociale = 'N/A';

    createDevis(
        $page.url.origin,
        String(raison_sociale),
        DevisTypes.cp,
        Number(String(values['projet_montant_des_recettes'])?.replaceAll?.(/[\n\r\s\t]+/g, '')),
        DevisStates.brouillons,
        values
    );
    // For POST --------

    fetch(origin + '/api/mail/send', {
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
        body: JSON.stringify({
            result_id: result_id,
            to: values?.['souscripteur_email'] ?? 'ayushchalise12@gmail.com',
            from: centralephotovoltaique?.partner?.mail?.from,
            templateId: centralephotovoltaique?.partner?.mail?.templateId,
            subject: values?.['souscripteur_email']
                ? centralephotovoltaique?.partner?.mail?.subject
                : 'Error with `souscripteur_email`, your fallback mail as ready.',
            pdfUrl: finalUrlDownloadPdf
            //TODO pdfUrl
            // pdfUrl: `${origin}/api/pdf/generate?compiler_id=${compiler.compilerId}&result_id=${savedFormId}`
        })
    })
        .then()
        .catch((e) => {
            if (dev) {
                console.log(e);
                console.log(e?.response?.body);
            }
        });

};
</script >

    <svelte:head>
        <title>assurmatch -centrale photovoltaique</title>
    </svelte:head>

{ #if isLoading }
<section class="h-screen">
    {#each[1, 2, 3, 4, 5] as _}
    <BasicSkeleton />
    {/each}
    </section>
{
    /if}



    < section
    class="antialiased bg-white {legalsShow || isLoading
        ? 'hidden lg:hidden pointer-events-none'
        : ''
} "
on: change = { onChange }
    >
    <aside
        aria-label="Sidenav"
        class="fixed top-0 left-0 z-40 w-[24rem] h-screen pt-4 transition-transform -translate-x-full bg-blue-900 border-r border-gray-200 lg:translate-x-0"
    >
        <div class="overflow-y-auto py-5 max-sm:mt-4 px-8 h-full bg-blue-900">
            <div class="flex flex-col items-center align-middle text-center text-gray-100 lg:mb-10">
                <figure class="min-w-[6rem] w-24 h-24 bg-white grid items-center justify-center rounded-lg">
                    <img
                        alt="assurmatch or partner"
                        src={centralephotovoltaique?.partner?.page?.imageUrl ?? '/icons/assurmatch.jpg'}
                    />
                </figure>
                <div class="mt-2">
                    <h1 class="font-bold">
                        {centralephotovoltaique?.partner?.page?.title}
                    </h1>
                    <h2 class="text-sm italic text-gray-300">
                        {centralephotovoltaique?.partner?.page?.details}
                    </h2>
                    {#if centralephotovoltaique?.partner?.page?.legalsUrl && centralephotovoltaique.partner.page.legalsUrl?.toString?.()?.length > 0}
                        <button
                            class="text-gray-100 underline text-sm text-start transition-all duration-300 ease-in-out hover:opacity-80"
                            on:click={toggleLegals}
                        >
                            Informations légales du cabinet
                        </button>
                    {/if}
                </div>
            </div>
            <div class="hidden lg:inline-block">
                <StepperVertical>
                    <StepperVerticalStep
                        bind:currentStep
                        stepDetails="Complétez ce formulaire et obtenez votre devis"
                        stepIcon="fa fa-door-open "
                        stepNumber={0}
                        stepTitle="Bienvenue"
                    />

                    <StepperVerticalStep
                        bind:currentStep
                        stepDetails="Qui êtes-vous ? Identifiez-vous comme l'acteur principal de cette assurance. Nous voulons adapter notre offre à vos besoins."
                        stepIcon="fa fa-user"
                        stepNumber={2}
                        stepTitle="Identification du Souscripteur"
                    />
                    <StepperVerticalStep
                        bind:currentStep
                        stepDetails="Parlez-nous des risques associés à votre projet. Une bonne compréhension nous permettra de mieux vous protéger."
                        stepIcon="fa fa-triangle-exclamation"
                        stepNumber={3}
                        stepTitle="Analyse de Votre Risque"
                    />
                    <StepperVerticalStep
                        bind:currentStep
                        stepDetails="Détaillez-nous vos attentes et spécificités. Plus nous en savons, mieux nous pourrons répondre à vos besoins."
                        stepIcon="fa fa-square-plus"
                        stepNumber={4}
                        stepTitle="Informations Complémentaires"
                    />
                </StepperVertical>
            </div>
        </div>
    </aside>

    <main class="p-4 lg:ml-[24rem] h-auto">
        <div class="rounded-lg min-h-[calc(100vh-7rem)] mb-4 flex flex-col justify-center items-center">
            <section class="absolute z-[30]">
                <article class="fixed top-0 left-0 right-0 flex items-center justify-center m-4">
                    <Toast bind:open={isToasted} color="red" simple transition={slide}>
                        <svelte:fragment slot="icon">
                            <i class=" fa fa-xmark" />
                        </svelte:fragment>
                        Un ou plusieurs champs ne sont pas remplis.
                    </Toast>
                </article>
            </section>

            <div class="lg:hidden">
                <div class="flex flex-col items-center align-middle text-center mb-6">
                    <figure
                        class="min-w-[6rem] w-24 h-24 bg-white grid items-center justify-center rounded-lg"
                    >
                        <img
                            alt="assurmatch or partner"
                            src={centralephotovoltaique?.partner?.page?.imageUrl ?? '/icons/assurmatch.jpg'}
                        />
                    </figure>
                    <div class="mt-2">
                        <h1 class="font-bold text-2xl">
                            {centralephotovoltaique?.partner?.page?.title}
                        </h1>
                        <h2 class="text-sm italic text-gray-400">
                            {centralephotovoltaique?.partner?.page?.details}
                        </h2>
                        {#if centralephotovoltaique?.partner?.page?.legalsUrl && centralephotovoltaique.partner.page.legalsUrl?.toString?.()?.length > 0}
                            <button
                                class="underline text-sm text-start transition-all duration-300 ease-in-out hover:opacity-80"
                                on:click={toggleLegals}
                            >
                                Informations légales du cabinet
                            </button>
                        {/if}
                    </div>
                </div>
                <!-- <StepperHorizontal>
                    <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-door-open"
                        stepNumber={0}
                        stepTitle="Bienvenue"
                        withSeparator={true}
                    />

                    <StepperVerticalStep
                        bind:currentStep
                        stepDetails="Qui êtes-vous ? Identifiez-vous comme l'acteur principal de cette assurance. Nous voulons adapter notre offre à vos besoins."
                        stepIcon="fa fa-user"
                        stepNumber={1}
                        stepTitle="Identification du Souscripteur"
                    />
                    <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-triangle-exclamation"
                        stepNumber={3}
                        stepTitle="Le Risque"
                        withSeparator={true}
                    />
                    <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-square-plus"
                        stepNumber={4}
                        stepTitle="Compléments"
                    />
                </StepperHorizontal> -->
                <StepperHorizontal>
                    <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-door-open"
                        stepNumber={0}
                        stepTitle="Bienvenue"
                        withSeparator={true}
                    />
                    <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-user"
                        stepNumber={1}
                        stepTitle="Identification du Souscripteur"
                        withSeparator={true}
                    />
                    <!-- <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-building"
                        stepNumber={2}
                        stepTitle="Entreprise"
                        withSeparator={true}
                    /> -->
                    <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-triangle-exclamation"
                        stepNumber={3}
                        stepTitle="Le Risque"
                        withSeparator={true}
                    />
                    <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-square-plus"
                        stepNumber={4}
                        stepTitle="Compléments"
                        withSeparator={true}
                    />
                    <!-- <StepperHorizontalStep
                        bind:currentStep
                        stepIcon="fa fa-square-plus"
                        stepNumber={5}
                        stepTitle="Compléments"
                    /> -->
                </StepperHorizontal>

            </div>

            <!-- :::::::::::


            <!-- ::::::::::: -->

             <div class="w-full bg-white rounded-lg shadow mt-4 lg:mt-0 sm:max-w-3xl xl:p-0">
                <!-- ---- -->
                <!-- <div class="hidden lg:inline-block bg-blue-900 p-4 flex items-center space-x-4 text-white z-50 sticky top-0" ></div> -->
                <!-- <div class="shadow bg-gray-50 mb-2 px-4 py-2 rounded sticky top-0  z-50">
    <div class="flex space-x-4  ">
        <StepperVertical >
            <div class="flex items-center space-x-4 text-gray-900  ">
                <StepperVerticalStep
                    bind:currentStep
                    stepDetails=""
                    stepIcon=""
                    stepNumber={0}
                    stepTitle="Bienvenue"
                />
                <StepperVerticalStep
                    bind:currentStep
                    stepDetails=""
                    stepIcon=""
                    stepNumber={2}
                    stepTitle="Identification du Souscripteur"
                />
                <StepperVerticalStep
                    bind:currentStep
                    stepDetails=""
                    stepIcon=""
                    stepNumber={3}
                    stepTitle="Analyse de Votre Risque"
                />
                <StepperVerticalStep
                    bind:currentStep
                    stepDetails=""
                    stepIcon=""
                    stepNumber={4}
                    stepTitle="Informations Complémentaires"
                />
            </div>
        </StepperVertical>
    </div>
</div> -->
                <!-- ----- -->
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    {#if false}
                        <p class="m-4">Form values: {JSON.
...

[Message clipped]  View entire message
