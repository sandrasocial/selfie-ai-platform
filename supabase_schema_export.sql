--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_imagery_collections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_imagery_collections (
    id integer NOT NULL,
    collection_name text NOT NULL,
    description text NOT NULL,
    thumbnail_url text NOT NULL,
    color_palette jsonb NOT NULL,
    brand_keywords jsonb NOT NULL,
    target_audience text NOT NULL,
    mood_description text NOT NULL,
    visual_elements jsonb NOT NULL,
    mockup_previews jsonb NOT NULL,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: ai_imagery_collections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ai_imagery_collections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ai_imagery_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_imagery_collections_id_seq OWNED BY public.ai_imagery_collections.id;


--
-- Name: ai_visual_strategies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ai_visual_strategies (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    brand_profile_snapshot jsonb,
    content_generated jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: brand_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_notes (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    tags text,
    category text DEFAULT 'general'::text NOT NULL,
    color text DEFAULT '#F8F9FA'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: calendar_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_content (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    day_of_week character varying,
    caption text,
    hook text,
    hashtags text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    image_url text,
    notes text
);


--
-- Name: calendar_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.calendar_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: calendar_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendar_content_id_seq OWNED BY public.calendar_content.id;


--
-- Name: calendar_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_entries (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    day_number integer NOT NULL,
    content_text text,
    template_name character varying(255),
    is_strategy boolean DEFAULT false,
    hook_text text,
    hashtags text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: calendar_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.calendar_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: calendar_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendar_entries_id_seq OWNED BY public.calendar_entries.id;


--
-- Name: collaboration_inquiries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.collaboration_inquiries (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    company character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    collaboration_type character varying(100) NOT NULL,
    message text NOT NULL,
    status character varying(50) DEFAULT 'new'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: collaboration_inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.collaboration_inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: collaboration_inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collaboration_inquiries_id_seq OWNED BY public.collaboration_inquiries.id;


--
-- Name: content_generations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_generations (
    id integer NOT NULL,
    user_id integer,
    image_url text NOT NULL,
    mood text NOT NULL,
    captions jsonb NOT NULL,
    affirmations jsonb NOT NULL,
    hashtags text NOT NULL,
    recommended_format text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    pose_tips jsonb NOT NULL,
    lighting_advice text NOT NULL,
    story_caption text NOT NULL,
    enhanced_image_url text,
    filter_style text DEFAULT 'natural'::text,
    brightness_adjust integer DEFAULT 0,
    contrast_adjust integer DEFAULT 0
);


--
-- Name: content_generations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.content_generations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: content_generations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.content_generations_id_seq OWNED BY public.content_generations.id;


--
-- Name: content_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_sessions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    user_id integer NOT NULL,
    session_type text DEFAULT 'content_generation'::text NOT NULL,
    prompt text NOT NULL,
    ai_response jsonb DEFAULT '{}'::jsonb NOT NULL,
    content_data jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: content_vault; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.content_vault (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    type text DEFAULT 'other'::text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: course_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_content (
    id integer NOT NULL,
    product_id character varying(255) NOT NULL,
    module_id character varying(255) NOT NULL,
    lesson_id character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    video_url character varying(255),
    pdf_url character varying(255),
    resource_urls jsonb,
    order_index integer DEFAULT 1 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    is_published boolean DEFAULT true
);


--
-- Name: course_content_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_content_id_seq OWNED BY public.course_content.id;


--
-- Name: course_notes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_notes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    course_id text NOT NULL,
    module_id text,
    lesson_id text,
    notes jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: course_notes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_notes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_notes_id_seq OWNED BY public.course_notes.id;


--
-- Name: course_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_progress (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    product_id character varying(255) NOT NULL,
    module_id character varying(255) NOT NULL,
    lesson_id character varying(255) NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    last_accessed timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: course_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_progress_id_seq OWNED BY public.course_progress.id;


--
-- Name: course_purchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.course_purchases (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    product_id character varying(255) NOT NULL,
    stripe_payment_intent_id character varying(255),
    amount numeric(10,2) NOT NULL,
    currency character varying(3) DEFAULT 'USD'::character varying,
    status character varying(50) DEFAULT 'completed'::character varying,
    purchased_at timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: course_purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.course_purchases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: course_purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_purchases_id_seq OWNED BY public.course_purchases.id;


--
-- Name: drop_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drop_views (
    id integer NOT NULL,
    user_id integer NOT NULL,
    drop_id text NOT NULL,
    viewed_at timestamp without time zone DEFAULT now()
);


--
-- Name: drop_views_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.drop_views_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: drop_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.drop_views_id_seq OWNED BY public.drop_views.id;


--
-- Name: email_deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_deliveries (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    email character varying NOT NULL,
    workbook_type character varying NOT NULL,
    pdf_url character varying NOT NULL,
    zapier_request_id character varying,
    status character varying DEFAULT 'sent'::character varying NOT NULL,
    sent_at timestamp without time zone DEFAULT now(),
    opened_at timestamp without time zone,
    clicked_at timestamp without time zone,
    downloaded_at timestamp without time zone
);


--
-- Name: email_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_deliveries_id_seq OWNED BY public.email_deliveries.id;


--
-- Name: feed_layout; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.feed_layout (
    id text NOT NULL,
    user_id integer NOT NULL,
    upload_id text NOT NULL,
    "position" integer NOT NULL,
    content_type text NOT NULL,
    added_to_calendar boolean DEFAULT false,
    saved_as_draft boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: freebie_signups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.freebie_signups (
    id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    subscribed_at timestamp without time zone DEFAULT now(),
    zapier_sent boolean DEFAULT false,
    email_sent boolean DEFAULT false
);


--
-- Name: freebie_signups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.freebie_signups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: freebie_signups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.freebie_signups_id_seq OWNED BY public.freebie_signups.id;


--
-- Name: generated_workbooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.generated_workbooks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    template_id character varying(100) NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    module_id character varying(50),
    course_id character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: generated_workbooks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.generated_workbooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: generated_workbooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.generated_workbooks_id_seq OWNED BY public.generated_workbooks.id;


--
-- Name: ladder_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ladder_progress (
    id integer NOT NULL,
    user_id text NOT NULL,
    vip_access boolean DEFAULT false,
    vip_pending boolean DEFAULT false,
    application_id integer,
    access_granted_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: ladder_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ladder_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ladder_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ladder_progress_id_seq OWNED BY public.ladder_progress.id;


--
-- Name: monthly_drops; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.monthly_drops (
    id text NOT NULL,
    title text NOT NULL,
    type text NOT NULL,
    description text NOT NULL,
    release_date timestamp without time zone NOT NULL,
    file_url text NOT NULL,
    is_featured boolean DEFAULT false,
    drip_enabled boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    slug text,
    tier_required text DEFAULT 'FREE'::text NOT NULL,
    available_from timestamp without time zone DEFAULT now()
);


--
-- Name: pdf_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pdf_logs (
    id integer NOT NULL,
    user_id character varying NOT NULL,
    title character varying NOT NULL,
    module character varying,
    type character varying NOT NULL,
    status character varying DEFAULT 'pending'::character varying,
    pdf_url text,
    generated_at timestamp without time zone DEFAULT now()
);


--
-- Name: pdf_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pdf_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pdf_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pdf_logs_id_seq OWNED BY public.pdf_logs.id;


--
-- Name: photo_library; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.photo_library (
    id integer NOT NULL,
    user_id integer NOT NULL,
    original_url text NOT NULL,
    edited_url text,
    thumbnail_url text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: photo_library_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.photo_library_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: photo_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.photo_library_id_seq OWNED BY public.photo_library.id;


--
-- Name: planner_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.planner_items (
    id text NOT NULL,
    user_id integer NOT NULL,
    date text NOT NULL,
    task text NOT NULL,
    created_by text NOT NULL,
    completed boolean DEFAULT false,
    activity jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: pose_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pose_sessions (
    id text DEFAULT (gen_random_uuid())::text NOT NULL,
    user_id integer NOT NULL,
    image_url text,
    pose_suggestions jsonb DEFAULT '[]'::jsonb NOT NULL,
    selected_pose text,
    feedback text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: purchases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.purchases (
    id character varying NOT NULL,
    user_id character varying NOT NULL,
    product_name character varying,
    amount integer NOT NULL,
    currency character varying(3) DEFAULT 'usd'::character varying,
    status character varying NOT NULL,
    type character varying DEFAULT 'subscription'::character varying,
    plan_id character varying,
    stripe_session_id character varying,
    stripe_customer_id character varying,
    stripe_subscription_id character varying,
    stripe_payment_intent_id character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: sandra_chats; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sandra_chats (
    id text NOT NULL,
    user_id integer NOT NULL,
    title text NOT NULL,
    messages jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: sandra_prompts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sandra_prompts (
    id integer NOT NULL,
    content text NOT NULL,
    category text DEFAULT 'general'::text,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: sandra_prompts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sandra_prompts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sandra_prompts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sandra_prompts_id_seq OWNED BY public.sandra_prompts.id;


--
-- Name: sandra_quotes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sandra_quotes (
    id integer NOT NULL,
    quote text NOT NULL,
    author text DEFAULT 'Sandra AI'::text,
    date_index integer NOT NULL,
    is_active boolean DEFAULT true
);


--
-- Name: sandra_quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.sandra_quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sandra_quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sandra_quotes_id_seq OWNED BY public.sandra_quotes.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- Name: starter_kit_certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.starter_kit_certificates (
    id integer NOT NULL,
    user_id integer NOT NULL,
    certificate_id text NOT NULL,
    completed_at timestamp without time zone DEFAULT now(),
    certificate_url text,
    module_completion_stats jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: starter_kit_certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.starter_kit_certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: starter_kit_certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.starter_kit_certificates_id_seq OWNED BY public.starter_kit_certificates.id;


--
-- Name: starter_kit_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.starter_kit_progress (
    id integer NOT NULL,
    user_id integer NOT NULL,
    module_id text NOT NULL,
    lesson_id text NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamp without time zone,
    time_spent integer DEFAULT 0,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: starter_kit_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.starter_kit_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: starter_kit_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.starter_kit_progress_id_seq OWNED BY public.starter_kit_progress.id;


--
-- Name: subscription_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscription_plans (
    id character varying NOT NULL,
    name character varying NOT NULL,
    description text,
    price integer NOT NULL,
    currency character varying(3) DEFAULT 'usd'::character varying,
    "interval" character varying NOT NULL,
    interval_count integer DEFAULT 1,
    stripe_price_id character varying,
    features text[],
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    tier character varying,
    stripe_product_id character varying
);


--
-- Name: template_customizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.template_customizations (
    id text NOT NULL,
    user_id text NOT NULL,
    template_type text NOT NULL,
    custom_data jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: uploads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.uploads (
    id text NOT NULL,
    user_id integer NOT NULL,
    file_url text NOT NULL,
    tags jsonb DEFAULT '[]'::jsonb,
    mood text,
    intent text,
    is_brand_asset boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: user_aesthetic_selections; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_aesthetic_selections (
    id integer NOT NULL,
    user_id integer NOT NULL,
    collection_id integer NOT NULL,
    selected_at timestamp without time zone DEFAULT now(),
    customizations jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: user_aesthetic_selections_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_aesthetic_selections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_aesthetic_selections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_aesthetic_selections_id_seq OWNED BY public.user_aesthetic_selections.id;


--
-- Name: user_profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_profiles (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    brand_mission text,
    ideal_audience text,
    brand_values text,
    key_phrases text,
    hashtags text,
    visual_aesthetic character varying(100),
    content_focus text[],
    tone_voice character varying(50),
    industry character varying(100),
    experience_level character varying(50),
    main_goals text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_complete boolean DEFAULT false,
    transformation_story text,
    brand_voice text,
    aesthetic_tone text,
    offer text,
    visibility_goals text
);


--
-- Name: user_profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    first_name text,
    last_name text,
    password text NOT NULL,
    stripe_customer_id text,
    stripe_subscription_id text,
    plan text DEFAULT 'free'::text NOT NULL,
    uploads_this_month integer DEFAULT 0 NOT NULL,
    last_reset_date timestamp without time zone DEFAULT now(),
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    profile_data jsonb,
    visual_gallery text[] DEFAULT '{}'::text[],
    image_generations_today integer DEFAULT 0,
    last_image_reset_date timestamp without time zone DEFAULT now(),
    name text,
    avatar_url text,
    subscription_status character varying DEFAULT 'inactive'::character varying,
    subscription_current_period_end timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: vault_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vault_entries (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    template_name character varying(255),
    content_text text NOT NULL,
    hook_text text,
    hashtags text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: vault_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vault_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vault_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vault_entries_id_seq OWNED BY public.vault_entries.id;


--
-- Name: vip_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vip_applications (
    id text NOT NULL,
    full_name character varying NOT NULL,
    email character varying NOT NULL,
    instagram character varying,
    website character varying,
    current_business text NOT NULL,
    why_vip text NOT NULL,
    goals text NOT NULL,
    budget character varying NOT NULL,
    submitted_at timestamp without time zone DEFAULT now(),
    status character varying DEFAULT 'pending'::character varying,
    notes text
);


--
-- Name: vip_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vip_progress (
    id integer NOT NULL,
    user_id text NOT NULL,
    current_stage integer DEFAULT 1,
    completed_stages jsonb DEFAULT '[]'::jsonb,
    last_viewed_stage integer,
    stage_progress jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: vip_progress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.vip_progress_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: vip_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vip_progress_id_seq OWNED BY public.vip_progress.id;


--
-- Name: visual_editor_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visual_editor_sessions (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    prompt_type text NOT NULL,
    editing_mode text NOT NULL,
    prompt text NOT NULL,
    context jsonb,
    ai_response text NOT NULL,
    generated_content jsonb,
    status text DEFAULT 'draft'::text,
    tags jsonb DEFAULT '[]'::jsonb,
    processing_time integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- Name: workbooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.workbooks (
    id integer NOT NULL,
    user_id text,
    module_id text NOT NULL,
    module_title character varying,
    title text NOT NULL,
    personalized_strategy text,
    action_items jsonb,
    custom_frameworks jsonb,
    implementation_plan text,
    key_insights jsonb,
    user_profile jsonb,
    responses jsonb,
    created_at timestamp without time zone DEFAULT now(),
    template_id character varying(255),
    course_id character varying(255),
    content text,
    selected_aesthetic character varying(255),
    notes text,
    download_url character varying(500)
);


--
-- Name: workbooks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.workbooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: workbooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.workbooks_id_seq OWNED BY public.workbooks.id;


--
-- Name: ai_imagery_collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_imagery_collections ALTER COLUMN id SET DEFAULT nextval('public.ai_imagery_collections_id_seq'::regclass);


--
-- Name: calendar_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_content ALTER COLUMN id SET DEFAULT nextval('public.calendar_content_id_seq'::regclass);


--
-- Name: calendar_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_entries ALTER COLUMN id SET DEFAULT nextval('public.calendar_entries_id_seq'::regclass);


--
-- Name: collaboration_inquiries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_inquiries ALTER COLUMN id SET DEFAULT nextval('public.collaboration_inquiries_id_seq'::regclass);


--
-- Name: content_generations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_generations ALTER COLUMN id SET DEFAULT nextval('public.content_generations_id_seq'::regclass);


--
-- Name: course_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_content ALTER COLUMN id SET DEFAULT nextval('public.course_content_id_seq'::regclass);


--
-- Name: course_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_notes ALTER COLUMN id SET DEFAULT nextval('public.course_notes_id_seq'::regclass);


--
-- Name: course_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress ALTER COLUMN id SET DEFAULT nextval('public.course_progress_id_seq'::regclass);


--
-- Name: course_purchases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_purchases ALTER COLUMN id SET DEFAULT nextval('public.course_purchases_id_seq'::regclass);


--
-- Name: drop_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views ALTER COLUMN id SET DEFAULT nextval('public.drop_views_id_seq'::regclass);


--
-- Name: email_deliveries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_deliveries ALTER COLUMN id SET DEFAULT nextval('public.email_deliveries_id_seq'::regclass);


--
-- Name: freebie_signups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freebie_signups ALTER COLUMN id SET DEFAULT nextval('public.freebie_signups_id_seq'::regclass);


--
-- Name: generated_workbooks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_workbooks ALTER COLUMN id SET DEFAULT nextval('public.generated_workbooks_id_seq'::regclass);


--
-- Name: ladder_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ladder_progress ALTER COLUMN id SET DEFAULT nextval('public.ladder_progress_id_seq'::regclass);


--
-- Name: pdf_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdf_logs ALTER COLUMN id SET DEFAULT nextval('public.pdf_logs_id_seq'::regclass);


--
-- Name: photo_library id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photo_library ALTER COLUMN id SET DEFAULT nextval('public.photo_library_id_seq'::regclass);


--
-- Name: sandra_prompts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_prompts ALTER COLUMN id SET DEFAULT nextval('public.sandra_prompts_id_seq'::regclass);


--
-- Name: sandra_quotes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_quotes ALTER COLUMN id SET DEFAULT nextval('public.sandra_quotes_id_seq'::regclass);


--
-- Name: starter_kit_certificates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_certificates ALTER COLUMN id SET DEFAULT nextval('public.starter_kit_certificates_id_seq'::regclass);


--
-- Name: starter_kit_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_progress ALTER COLUMN id SET DEFAULT nextval('public.starter_kit_progress_id_seq'::regclass);


--
-- Name: user_aesthetic_selections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_aesthetic_selections ALTER COLUMN id SET DEFAULT nextval('public.user_aesthetic_selections_id_seq'::regclass);


--
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vault_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vault_entries ALTER COLUMN id SET DEFAULT nextval('public.vault_entries_id_seq'::regclass);


--
-- Name: vip_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vip_progress ALTER COLUMN id SET DEFAULT nextval('public.vip_progress_id_seq'::regclass);


--
-- Name: workbooks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workbooks ALTER COLUMN id SET DEFAULT nextval('public.workbooks_id_seq'::regclass);


--
-- Name: ai_imagery_collections ai_imagery_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_imagery_collections
    ADD CONSTRAINT ai_imagery_collections_pkey PRIMARY KEY (id);


--
-- Name: ai_visual_strategies ai_visual_strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_visual_strategies
    ADD CONSTRAINT ai_visual_strategies_pkey PRIMARY KEY (id);


--
-- Name: brand_notes brand_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_notes
    ADD CONSTRAINT brand_notes_pkey PRIMARY KEY (id);


--
-- Name: calendar_content calendar_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_content
    ADD CONSTRAINT calendar_content_pkey PRIMARY KEY (id);


--
-- Name: calendar_entries calendar_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_entries
    ADD CONSTRAINT calendar_entries_pkey PRIMARY KEY (id);


--
-- Name: collaboration_inquiries collaboration_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_inquiries
    ADD CONSTRAINT collaboration_inquiries_pkey PRIMARY KEY (id);


--
-- Name: content_generations content_generations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_generations
    ADD CONSTRAINT content_generations_pkey PRIMARY KEY (id);


--
-- Name: content_sessions content_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_sessions
    ADD CONSTRAINT content_sessions_pkey PRIMARY KEY (id);


--
-- Name: content_vault content_vault_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_vault
    ADD CONSTRAINT content_vault_pkey PRIMARY KEY (id);


--
-- Name: course_content course_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_content
    ADD CONSTRAINT course_content_pkey PRIMARY KEY (id);


--
-- Name: course_notes course_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_notes
    ADD CONSTRAINT course_notes_pkey PRIMARY KEY (id);


--
-- Name: course_progress course_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_pkey PRIMARY KEY (id);


--
-- Name: course_progress course_progress_user_id_product_id_module_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_user_id_product_id_module_id_lesson_id_key UNIQUE (user_id, product_id, module_id, lesson_id);


--
-- Name: course_purchases course_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_purchases
    ADD CONSTRAINT course_purchases_pkey PRIMARY KEY (id);


--
-- Name: course_purchases course_purchases_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_purchases
    ADD CONSTRAINT course_purchases_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- Name: drop_views drop_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views
    ADD CONSTRAINT drop_views_pkey PRIMARY KEY (id);


--
-- Name: email_deliveries email_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_deliveries
    ADD CONSTRAINT email_deliveries_pkey PRIMARY KEY (id);


--
-- Name: feed_layout feed_layout_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feed_layout
    ADD CONSTRAINT feed_layout_pkey PRIMARY KEY (id);


--
-- Name: freebie_signups freebie_signups_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freebie_signups
    ADD CONSTRAINT freebie_signups_email_key UNIQUE (email);


--
-- Name: freebie_signups freebie_signups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freebie_signups
    ADD CONSTRAINT freebie_signups_pkey PRIMARY KEY (id);


--
-- Name: generated_workbooks generated_workbooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_workbooks
    ADD CONSTRAINT generated_workbooks_pkey PRIMARY KEY (id);


--
-- Name: ladder_progress ladder_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ladder_progress
    ADD CONSTRAINT ladder_progress_pkey PRIMARY KEY (id);


--
-- Name: monthly_drops monthly_drops_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_drops
    ADD CONSTRAINT monthly_drops_pkey PRIMARY KEY (id);


--
-- Name: monthly_drops monthly_drops_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_drops
    ADD CONSTRAINT monthly_drops_slug_key UNIQUE (slug);


--
-- Name: pdf_logs pdf_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdf_logs
    ADD CONSTRAINT pdf_logs_pkey PRIMARY KEY (id);


--
-- Name: photo_library photo_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photo_library
    ADD CONSTRAINT photo_library_pkey PRIMARY KEY (id);


--
-- Name: planner_items planner_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planner_items
    ADD CONSTRAINT planner_items_pkey PRIMARY KEY (id);


--
-- Name: pose_sessions pose_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pose_sessions
    ADD CONSTRAINT pose_sessions_pkey PRIMARY KEY (id);


--
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- Name: sandra_chats sandra_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_chats
    ADD CONSTRAINT sandra_chats_pkey PRIMARY KEY (id);


--
-- Name: sandra_prompts sandra_prompts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_prompts
    ADD CONSTRAINT sandra_prompts_pkey PRIMARY KEY (id);


--
-- Name: sandra_quotes sandra_quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_quotes
    ADD CONSTRAINT sandra_quotes_pkey PRIMARY KEY (id);


--
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- Name: starter_kit_certificates starter_kit_certificates_certificate_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_certificates
    ADD CONSTRAINT starter_kit_certificates_certificate_id_key UNIQUE (certificate_id);


--
-- Name: starter_kit_certificates starter_kit_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_certificates
    ADD CONSTRAINT starter_kit_certificates_pkey PRIMARY KEY (id);


--
-- Name: starter_kit_progress starter_kit_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_progress
    ADD CONSTRAINT starter_kit_progress_pkey PRIMARY KEY (id);


--
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- Name: template_customizations template_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.template_customizations
    ADD CONSTRAINT template_customizations_pkey PRIMARY KEY (id);


--
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (id);


--
-- Name: user_aesthetic_selections user_aesthetic_selections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_aesthetic_selections
    ADD CONSTRAINT user_aesthetic_selections_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vault_entries vault_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vault_entries
    ADD CONSTRAINT vault_entries_pkey PRIMARY KEY (id);


--
-- Name: vip_applications vip_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vip_applications
    ADD CONSTRAINT vip_applications_pkey PRIMARY KEY (id);


--
-- Name: vip_progress vip_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vip_progress
    ADD CONSTRAINT vip_progress_pkey PRIMARY KEY (id);


--
-- Name: visual_editor_sessions visual_editor_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visual_editor_sessions
    ADD CONSTRAINT visual_editor_sessions_pkey PRIMARY KEY (id);


--
-- Name: workbooks workbooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workbooks
    ADD CONSTRAINT workbooks_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- Name: idx_generated_workbooks_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generated_workbooks_user ON public.generated_workbooks USING btree (user_id);


--
-- Name: idx_starter_kit_progress_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_starter_kit_progress_user ON public.starter_kit_progress USING btree (user_id);


--
-- Name: idx_user_profiles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles USING btree (user_id);


--
-- Name: user_profiles update_user_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: content_generations content_generations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_generations
    ADD CONSTRAINT content_generations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: drop_views drop_views_drop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views
    ADD CONSTRAINT drop_views_drop_id_fkey FOREIGN KEY (drop_id) REFERENCES public.monthly_drops(id);


--
-- Name: drop_views drop_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views
    ADD CONSTRAINT drop_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

