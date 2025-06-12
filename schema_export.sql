pg_dump: last built-in OID is 16383
pg_dump: reading extensions
pg_dump: identifying extension members
pg_dump: reading schemas
pg_dump: reading user-defined tables
pg_dump: reading user-defined functions
pg_dump: reading user-defined types
pg_dump: reading procedural languages
pg_dump: reading user-defined aggregate functions
pg_dump: reading user-defined operators
pg_dump: reading user-defined access methods
pg_dump: reading user-defined operator classes
pg_dump: reading user-defined operator families
pg_dump: reading user-defined text search parsers
pg_dump: reading user-defined text search templates
pg_dump: reading user-defined text search dictionaries
pg_dump: reading user-defined text search configurations
pg_dump: reading user-defined foreign-data wrappers
pg_dump: reading user-defined foreign servers
pg_dump: reading default privileges
pg_dump: reading user-defined collations
pg_dump: reading user-defined conversions
pg_dump: reading type casts
pg_dump: reading transforms
pg_dump: reading table inheritance information
pg_dump: reading event triggers
pg_dump: finding extension tables
pg_dump: finding inheritance relationships
pg_dump: reading column info for interesting tables
pg_dump: finding table default expressions
pg_dump: flagging inherited columns in subtables
pg_dump: reading partitioning data
pg_dump: reading indexes
pg_dump: flagging indexes in partitioned tables
pg_dump: reading extended statistics
pg_dump: reading constraints
pg_dump: reading triggers
pg_dump: reading rewrite rules
pg_dump: reading policies
pg_dump: reading row-level security policies
pg_dump: reading publications
pg_dump: reading publication membership of tables
pg_dump: reading publication membership of schemas
pg_dump: reading subscriptions
pg_dump: reading dependency data
pg_dump: saving encoding = UTF8
pg_dump: saving standard_conforming_strings = on
pg_dump: saving search_path = 
pg_dump: creating FUNCTION "public.update_updated_at_column()"
pg_dump: creating TABLE "public.ai_imagery_collections"
pg_dump: creating SEQUENCE "public.ai_imagery_collections_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.ai_imagery_collections_id_seq"
pg_dump: creating TABLE "public.ai_visual_strategies"
pg_dump: creating TABLE "public.brand_notes"
pg_dump: creating TABLE "public.calendar_content"
pg_dump: creating SEQUENCE "public.calendar_content_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.calendar_content_id_seq"
pg_dump: creating TABLE "public.calendar_entries"
--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

-- Started on 2025-06-12 17:06:17 UTC

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
-- TOC entry 295 (class 1255 OID 1605648)
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
-- TOC entry 265 (class 1259 OID 1097729)
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
-- TOC entry 264 (class 1259 OID 1097728)
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
-- TOC entry 3790 (class 0 OID 0)
-- Dependencies: 264
-- Name: ai_imagery_collections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ai_imagery_collections_id_seq OWNED BY public.ai_imagery_collections.id;


--
-- TOC entry 281 (class 1259 OID 1875968)
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
-- TOC entry 282 (class 1259 OID 1941505)
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
-- TOC entry 224 (class 1259 OID 540673)
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
-- TOC entry 223 (class 1259 OID 540672)
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
-- TOC entry 3791 (class 0 OID 0)
-- Dependencies: 223
-- Name: calendar_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendar_content_id_seq OWNED BY public.calendar_content.id;


--
-- TOC entry 236 (class 1259 OID 638987)
-- Name: calendar_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.calendar_entries (
    id integer NOT NULL,
    user_id character varying(255) NOT NULL,
    day_number integer NOT NULL,
    conpg_dump: creating SEQUENCE "public.calendar_entries_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.calendar_entries_id_seq"
pg_dump: creating TABLE "public.collaboration_inquiries"
pg_dump: creating SEQUENCE "public.collaboration_inquiries_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.collaboration_inquiries_id_seq"
pg_dump: creating TABLE "public.content_generations"
pg_dump: creating SEQUENCE "public.content_generations_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.content_generations_id_seq"
pg_dump: creating TABLE "public.content_sessions"
pg_dump: creating TABLE "public.content_vault"
pg_dump: creating TABLE "public.course_content"
tent_text text,
    template_name character varying(255),
    is_strategy boolean DEFAULT false,
    hook_text text,
    hashtags text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- TOC entry 235 (class 1259 OID 638986)
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
-- TOC entry 3792 (class 0 OID 0)
-- Dependencies: 235
-- Name: calendar_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.calendar_entries_id_seq OWNED BY public.calendar_entries.id;


--
-- TOC entry 256 (class 1259 OID 729089)
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
-- TOC entry 255 (class 1259 OID 729088)
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
-- TOC entry 3793 (class 0 OID 0)
-- Dependencies: 255
-- Name: collaboration_inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.collaboration_inquiries_id_seq OWNED BY public.collaboration_inquiries.id;


--
-- TOC entry 216 (class 1259 OID 24577)
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
-- TOC entry 215 (class 1259 OID 24576)
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
-- TOC entry 3794 (class 0 OID 0)
-- Dependencies: 215
-- Name: content_generations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.content_generations_id_seq OWNED BY public.content_generations.id;


--
-- TOC entry 272 (class 1259 OID 1105932)
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
-- TOC entry 283 (class 1259 OID 1941518)
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
-- TOC entry 228 (class 1pg_dump: creating SEQUENCE "public.course_content_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.course_content_id_seq"
pg_dump: creating TABLE "public.course_notes"
pg_dump: creating SEQUENCE "public.course_notes_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.course_notes_id_seq"
pg_dump: creating TABLE "public.course_progress"
pg_dump: creating SEQUENCE "public.course_progress_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.course_progress_id_seq"
pg_dump: creating TABLE "public.course_purchases"
pg_dump: creating SEQUENCE "public.course_purchases_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.course_purchases_id_seq"
259 OID 630785)
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
-- TOC entry 227 (class 1259 OID 630784)
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
-- TOC entry 3795 (class 0 OID 0)
-- Dependencies: 227
-- Name: course_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_content_id_seq OWNED BY public.course_content.id;


--
-- TOC entry 277 (class 1259 OID 1490945)
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
-- TOC entry 276 (class 1259 OID 1490944)
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
-- TOC entry 3796 (class 0 OID 0)
-- Dependencies: 276
-- Name: course_notes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_notes_id_seq OWNED BY public.course_notes.id;


--
-- TOC entry 230 (class 1259 OID 630797)
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
-- TOC entry 229 (class 1259 OID 630796)
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
-- TOC entry 3797 (class 0 OID 0)
-- Dependencies: 229
-- Name: course_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_progress_id_seq OWNED BY public.course_progress.id;


--
-- TOC entry 232 (class 1259 OID 630811)
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
-- TOC entry 231 (class 1259 OID 630810)
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
-- TOC entry 3798 (class 0 OID 0)
-- Dependencies: 231
-- Name: course_purchases_id_seq; Typepg_dump: creating TABLE "public.drop_views"
pg_dump: creating SEQUENCE "public.drop_views_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.drop_views_id_seq"
pg_dump: creating TABLE "public.email_deliveries"
pg_dump: creating SEQUENCE "public.email_deliveries_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.email_deliveries_id_seq"
pg_dump: creating TABLE "public.feed_layout"
pg_dump: creating TABLE "public.freebie_signups"
pg_dump: creating SEQUENCE "public.freebie_signups_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.freebie_signups_id_seq"
pg_dump: creating TABLE "public.generated_workbooks"
pg_dump: creating SEQUENCE "public.generated_workbooks_id_seq"
: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.course_purchases_id_seq OWNED BY public.course_purchases.id;


--
-- TOC entry 260 (class 1259 OID 753675)
-- Name: drop_views; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.drop_views (
    id integer NOT NULL,
    user_id integer NOT NULL,
    drop_id text NOT NULL,
    viewed_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 259 (class 1259 OID 753674)
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
-- TOC entry 3799 (class 0 OID 0)
-- Dependencies: 259
-- Name: drop_views_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.drop_views_id_seq OWNED BY public.drop_views.id;


--
-- TOC entry 226 (class 1259 OID 622593)
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
-- TOC entry 225 (class 1259 OID 622592)
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
-- TOC entry 3800 (class 0 OID 0)
-- Dependencies: 225
-- Name: email_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_deliveries_id_seq OWNED BY public.email_deliveries.id;


--
-- TOC entry 250 (class 1259 OID 696331)
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
-- TOC entry 240 (class 1259 OID 655361)
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
-- TOC entry 239 (class 1259 OID 655360)
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
-- TOC entry 3801 (class 0 OID 0)
-- Dependencies: 239
-- Name: freebie_signups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.freebie_signups_id_seq OWNED BY public.freebie_signups.id;


--
-- TOC entry 275 (class 1259 OID 1376257)
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
-- TOC entry 274 (class 1259 OID 1376256)
-- Name: generated_workbooks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.generated_workbooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINpg_dump: creating SEQUENCE OWNED BY "public.generated_workbooks_id_seq"
pg_dump: creating TABLE "public.ladder_progress"
pg_dump: creating SEQUENCE "public.ladder_progress_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.ladder_progress_id_seq"
pg_dump: creating TABLE "public.monthly_drops"
pg_dump: creating TABLE "public.pdf_logs"
pg_dump: creating SEQUENCE "public.pdf_logs_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.pdf_logs_id_seq"
pg_dump: creating TABLE "public.photo_library"
pg_dump: creating SEQUENCE "public.photo_library_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.photo_library_id_seq"
pg_dump: creating TABLE "public.planner_items"
VALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3802 (class 0 OID 0)
-- Dependencies: 274
-- Name: generated_workbooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.generated_workbooks_id_seq OWNED BY public.generated_workbooks.id;


--
-- TOC entry 252 (class 1259 OID 712718)
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
-- TOC entry 251 (class 1259 OID 712717)
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
-- TOC entry 3803 (class 0 OID 0)
-- Dependencies: 251
-- Name: ladder_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ladder_progress_id_seq OWNED BY public.ladder_progress.id;


--
-- TOC entry 247 (class 1259 OID 679936)
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
-- TOC entry 263 (class 1259 OID 770049)
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
-- TOC entry 262 (class 1259 OID 770048)
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
-- TOC entry 3804 (class 0 OID 0)
-- Dependencies: 262
-- Name: pdf_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pdf_logs_id_seq OWNED BY public.pdf_logs.id;


--
-- TOC entry 238 (class 1259 OID 647169)
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
-- TOC entry 237 (class 1259 OID 647168)
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
-- TOC entry 3805 (class 0 OID 0)
-- Dependencies: 237
-- Name: photo_library_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.photo_library_id_seq OWNED BY public.photo_library.id;


--
-- TOC entry 248 (class 1259 OID 688128)
-- Name: planner_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.planner_items (
    id text NOT NULL,
    user_id integer NOT NULL,
    date text NOT NULL,
    task text NOT NULL,
    created_by text NOT NULL,
    completed boolean DEFAULT false,
    activity pg_dump: creating TABLE "public.pose_sessions"
pg_dump: creating TABLE "public.purchases"
pg_dump: creating TABLE "public.sandra_chats"
pg_dump: creating TABLE "public.sandra_prompts"
pg_dump: creating SEQUENCE "public.sandra_prompts_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.sandra_prompts_id_seq"
pg_dump: creating TABLE "public.sandra_quotes"
pg_dump: creating SEQUENCE "public.sandra_quotes_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.sandra_quotes_id_seq"
pg_dump: creating TABLE "public.sessions"
pg_dump: creating TABLE "public.starter_kit_certificates"
jsonb DEFAULT '{}'::jsonb,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


--
-- TOC entry 273 (class 1259 OID 1105945)
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
-- TOC entry 258 (class 1259 OID 737292)
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
-- TOC entry 242 (class 1259 OID 671754)
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
-- TOC entry 244 (class 1259 OID 671765)
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
-- TOC entry 243 (class 1259 OID 671764)
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
-- TOC entry 3806 (class 0 OID 0)
-- Dependencies: 243
-- Name: sandra_prompts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sandra_prompts_id_seq OWNED BY public.sandra_prompts.id;


--
-- TOC entry 246 (class 1259 OID 671777)
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
-- TOC entry 245 (class 1259 OID 671776)
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
-- TOC entry 3807 (class 0 OID 0)
-- Dependencies: 245
-- Name: sandra_quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.sandra_quotes_id_seq OWNED BY public.sandra_quotes.id;


--
-- TOC entry 217 (class 1259 OID 24586)
-- Name: sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sessions (
    sid character varying NOT NULL,
    sess jsonb NOT NULL,
    expire timestamp without time zone NOT NULL
);


--
-- TOC entry 269 (class 1259 OID 1097753)
-- Name: starter_kit_certificates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.starter_kit_certificates (
    id integer NOT NULL,
    user_id integer NOT NULL,
    certificate_id text NOT NULL,
    completed_at timestamp without time zone DEFAULT now(),
    certificate_url text,
    module_completion_stats jsonb NOT NULL,
    created_at timestamp without time zopg_dump: creating SEQUENCE "public.starter_kit_certificates_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.starter_kit_certificates_id_seq"
pg_dump: creating TABLE "public.starter_kit_progress"
pg_dump: creating SEQUENCE "public.starter_kit_progress_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.starter_kit_progress_id_seq"
pg_dump: creating TABLE "public.subscription_plans"
pg_dump: creating TABLE "public.template_customizations"
pg_dump: creating TABLE "public.uploads"
pg_dump: creating TABLE "public.user_aesthetic_selections"
pg_dump: creating SEQUENCE "public.user_aesthetic_selections_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.user_aesthetic_selections_id_seq"
ne DEFAULT now()
);


--
-- TOC entry 268 (class 1259 OID 1097752)
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
-- TOC entry 3808 (class 0 OID 0)
-- Dependencies: 268
-- Name: starter_kit_certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.starter_kit_certificates_id_seq OWNED BY public.starter_kit_certificates.id;


--
-- TOC entry 271 (class 1259 OID 1097766)
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
-- TOC entry 270 (class 1259 OID 1097765)
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
-- TOC entry 3809 (class 0 OID 0)
-- Dependencies: 270
-- Name: starter_kit_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.starter_kit_progress_id_seq OWNED BY public.starter_kit_progress.id;


--
-- TOC entry 257 (class 1259 OID 737280)
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
-- TOC entry 261 (class 1259 OID 761856)
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
-- TOC entry 249 (class 1259 OID 696320)
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
-- TOC entry 267 (class 1259 OID 1097741)
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
-- TOC entry 266 (class 1259 OID 1097740)
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
-- TOC entry 3810 (class 0 OID 0)
-- Dependencies: 266
-- Name: user_aesthetic_selections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pg_dump: creating TABLE "public.user_profiles"
pg_dump: creating SEQUENCE "public.user_profiles_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.user_profiles_id_seq"
pg_dump: creating TABLE "public.user_sessions"
pg_dump: creating TABLE "public.users"
pg_dump: creating SEQUENCE "public.users_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.users_id_seq"
pg_dump: creating TABLE "public.vault_entries"
pg_dump: creating SEQUENCE "public.vault_entries_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.vault_entries_id_seq"
pg_dump: creating TABLE "public.vip_applications"
user_aesthetic_selections_id_seq OWNED BY public.user_aesthetic_selections.id;


--
-- TOC entry 279 (class 1259 OID 1605633)
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
-- TOC entry 278 (class 1259 OID 1605632)
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
-- TOC entry 3811 (class 0 OID 0)
-- Dependencies: 278
-- Name: user_profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_profiles_id_seq OWNED BY public.user_profiles.id;


--
-- TOC entry 222 (class 1259 OID 122880)
-- Name: user_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_sessions (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


--
-- TOC entry 219 (class 1259 OID 24594)
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
-- TOC entry 218 (class 1259 OID 24593)
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
-- TOC entry 3812 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 234 (class 1259 OID 638977)
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
-- TOC entry 233 (class 1259 OID 638976)
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
-- TOC entry 3813 (class 0 OID 0)
-- Dependencies: 233
-- Name: vault_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vault_entries_id_seq OWNED BY public.vault_entries.id;


--
-- TOC entry 241 (class 1259 OID 663552)
-- Name: vip_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vpg_dump: creating TABLE "public.vip_progress"
pg_dump: creating SEQUENCE "public.vip_progress_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.vip_progress_id_seq"
pg_dump: creating TABLE "public.visual_editor_sessions"
pg_dump: creating TABLE "public.workbooks"
pg_dump: creating SEQUENCE "public.workbooks_id_seq"
pg_dump: creating SEQUENCE OWNED BY "public.workbooks_id_seq"
pg_dump: creating DEFAULT "public.ai_imagery_collections id"
pg_dump: creating DEFAULT "public.calendar_content id"
pg_dump: creating DEFAULT "public.calendar_entries id"
pg_dump: creating DEFAULT "public.collaboration_inquiries id"
ip_applications (
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
-- TOC entry 254 (class 1259 OID 712731)
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
-- TOC entry 253 (class 1259 OID 712730)
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
-- TOC entry 3814 (class 0 OID 0)
-- Dependencies: 253
-- Name: vip_progress_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.vip_progress_id_seq OWNED BY public.vip_progress.id;


--
-- TOC entry 280 (class 1259 OID 1843200)
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
-- TOC entry 221 (class 1259 OID 81921)
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
-- TOC entry 220 (class 1259 OID 81920)
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
-- TOC entry 3815 (class 0 OID 0)
-- Dependencies: 220
-- Name: workbooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.workbooks_id_seq OWNED BY public.workbooks.id;


--
-- TOC entry 3485 (class 2604 OID 1097732)
-- Name: ai_imagery_collections id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_imagery_collections ALTER COLUMN id SET DEFAULT nextval('public.ai_imagery_collections_id_seq'::regclass);


--
-- TOC entry 3391 (class 2604 OID 540676)
-- Name: calendar_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_content ALTER COLUMN id SET DEFAULT nextval('public.calendar_content_id_seq'::regclass);


--
-- TOC entry 3413 (class 2604 OID 638990)
-- Name: calendar_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_entries ALTER COLUMN id SET DEFAULT nextval('public.calendar_entries_id_seq'::regclass);


--
-- TOC entry 3465 (class 2604 OID 729092)
-- Name: collaboration_inquiries id; Type: DEFAULT; Schema: public; Owner: -
-pg_dump: creating DEFAULT "public.content_generations id"
pg_dump: creating DEFAULT "public.course_content id"
pg_dump: creating DEFAULT "public.course_notes id"
pg_dump: creating DEFAULT "public.course_progress id"
pg_dump: creating DEFAULT "public.course_purchases id"
pg_dump: creating DEFAULT "public.drop_views id"
pg_dump: creating DEFAULT "public.email_deliveries id"
pg_dump: creating DEFAULT "public.freebie_signups id"
pg_dump: creating DEFAULT "public.generated_workbooks id"
pg_dump: creating DEFAULT "public.ladder_progress id"
pg_dump: creating DEFAULT "public.pdf_logs id"
pg_dump: creating DEFAULT "public.photo_library id"
pg_dump: creating DEFAULT "public.sandra_prompts id"
pg_dump: creating DEFAULT "public.sandra_quotes id"
pg_dump: creating DEFAULT "public.starter_kit_certificates id"
pg_dump: creating DEFAULT "public.starter_kit_progress id"
pg_dump: creating DEFAULT "public.user_aesthetic_selections id"
-

ALTER TABLE ONLY public.collaboration_inquiries ALTER COLUMN id SET DEFAULT nextval('public.collaboration_inquiries_id_seq'::regclass);


--
-- TOC entry 3374 (class 2604 OID 24580)
-- Name: content_generations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_generations ALTER COLUMN id SET DEFAULT nextval('public.content_generations_id_seq'::regclass);


--
-- TOC entry 3397 (class 2604 OID 630788)
-- Name: course_content id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_content ALTER COLUMN id SET DEFAULT nextval('public.course_content_id_seq'::regclass);


--
-- TOC entry 3513 (class 2604 OID 1490948)
-- Name: course_notes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_notes ALTER COLUMN id SET DEFAULT nextval('public.course_notes_id_seq'::regclass);


--
-- TOC entry 3402 (class 2604 OID 630800)
-- Name: course_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress ALTER COLUMN id SET DEFAULT nextval('public.course_progress_id_seq'::regclass);


--
-- TOC entry 3406 (class 2604 OID 630814)
-- Name: course_purchases id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_purchases ALTER COLUMN id SET DEFAULT nextval('public.course_purchases_id_seq'::regclass);


--
-- TOC entry 3478 (class 2604 OID 753678)
-- Name: drop_views id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views ALTER COLUMN id SET DEFAULT nextval('public.drop_views_id_seq'::regclass);


--
-- TOC entry 3394 (class 2604 OID 622596)
-- Name: email_deliveries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_deliveries ALTER COLUMN id SET DEFAULT nextval('public.email_deliveries_id_seq'::regclass);


--
-- TOC entry 3420 (class 2604 OID 655364)
-- Name: freebie_signups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freebie_signups ALTER COLUMN id SET DEFAULT nextval('public.freebie_signups_id_seq'::regclass);


--
-- TOC entry 3511 (class 2604 OID 1376260)
-- Name: generated_workbooks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_workbooks ALTER COLUMN id SET DEFAULT nextval('public.generated_workbooks_id_seq'::regclass);


--
-- TOC entry 3454 (class 2604 OID 712721)
-- Name: ladder_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ladder_progress ALTER COLUMN id SET DEFAULT nextval('public.ladder_progress_id_seq'::regclass);


--
-- TOC entry 3482 (class 2604 OID 770052)
-- Name: pdf_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdf_logs ALTER COLUMN id SET DEFAULT nextval('public.pdf_logs_id_seq'::regclass);


--
-- TOC entry 3416 (class 2604 OID 647172)
-- Name: photo_library id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photo_library ALTER COLUMN id SET DEFAULT nextval('public.photo_library_id_seq'::regclass);


--
-- TOC entry 3429 (class 2604 OID 671768)
-- Name: sandra_prompts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_prompts ALTER COLUMN id SET DEFAULT nextval('public.sandra_prompts_id_seq'::regclass);


--
-- TOC entry 3433 (class 2604 OID 671780)
-- Name: sandra_quotes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_quotes ALTER COLUMN id SET DEFAULT nextval('public.sandra_quotes_id_seq'::regclass);


--
-- TOC entry 3493 (class 2604 OID 1097756)
-- Name: starter_kit_certificates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_certificates ALTER COLUMN id SET DEFAULT nextval('public.starter_kit_certificates_id_seq'::regclass);


--
-- TOC entry 3496 (class 2604 OID 1097769)
-- Name: starter_kit_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_progress ALTER COLUMN id SET DEFAULT nextval('public.starter_kit_progress_id_seq'::regclass);


--
-- TOC entry 3489 (class 2604 OID 1097744)
-- Name: user_aesthetic_selections id; Type: DEFAULT; Schpg_dump: creating DEFAULT "public.user_profiles id"
pg_dump: creating DEFAULT "public.users id"
pg_dump: creating DEFAULT "public.vault_entries id"
pg_dump: creating DEFAULT "public.vip_progress id"
pg_dump: creating DEFAULT "public.workbooks id"
pg_dump: creating CONSTRAINT "public.ai_imagery_collections ai_imagery_collections_pkey"
pg_dump: creating CONSTRAINT "public.ai_visual_strategies ai_visual_strategies_pkey"
pg_dump: creating CONSTRAINT "public.brand_notes brand_notes_pkey"
pg_dump: creating CONSTRAINT "public.calendar_content calendar_content_pkey"
pg_dump: creating CONSTRAINT "public.calendar_entries calendar_entries_pkey"
pg_dump: creating CONSTRAINT "public.collaboration_inquiries collaboration_inquiries_pkey"
pg_dump: creating CONSTRAINT "public.content_generations content_generations_pkey"
pg_dump: creating CONSTRAINT "public.content_sessions content_sessions_pkey"
pg_dump: creating CONSTRAINT "public.content_vault content_vault_pkey"
pg_dump: creating CONSTRAINT "public.course_content course_content_pkey"
pg_dump: creating CONSTRAINT "public.course_notes course_notes_pkey"
pg_dump: creating CONSTRAINT "public.course_progress course_progress_pkey"
ema: public; Owner: -
--

ALTER TABLE ONLY public.user_aesthetic_selections ALTER COLUMN id SET DEFAULT nextval('public.user_aesthetic_selections_id_seq'::regclass);


--
-- TOC entry 3517 (class 2604 OID 1605636)
-- Name: user_profiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles ALTER COLUMN id SET DEFAULT nextval('public.user_profiles_id_seq'::regclass);


--
-- TOC entry 3379 (class 2604 OID 24597)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3411 (class 2604 OID 638980)
-- Name: vault_entries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vault_entries ALTER COLUMN id SET DEFAULT nextval('public.vault_entries_id_seq'::regclass);


--
-- TOC entry 3459 (class 2604 OID 712734)
-- Name: vip_progress id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vip_progress ALTER COLUMN id SET DEFAULT nextval('public.vip_progress_id_seq'::regclass);


--
-- TOC entry 3389 (class 2604 OID 81924)
-- Name: workbooks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workbooks ALTER COLUMN id SET DEFAULT nextval('public.workbooks_id_seq'::regclass);


--
-- TOC entry 3606 (class 2606 OID 1097739)
-- Name: ai_imagery_collections ai_imagery_collections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_imagery_collections
    ADD CONSTRAINT ai_imagery_collections_pkey PRIMARY KEY (id);


--
-- TOC entry 3633 (class 2606 OID 1875975)
-- Name: ai_visual_strategies ai_visual_strategies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ai_visual_strategies
    ADD CONSTRAINT ai_visual_strategies_pkey PRIMARY KEY (id);


--
-- TOC entry 3635 (class 2606 OID 1941515)
-- Name: brand_notes brand_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_notes
    ADD CONSTRAINT brand_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3548 (class 2606 OID 540682)
-- Name: calendar_content calendar_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_content
    ADD CONSTRAINT calendar_content_pkey PRIMARY KEY (id);


--
-- TOC entry 3564 (class 2606 OID 638996)
-- Name: calendar_entries calendar_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.calendar_entries
    ADD CONSTRAINT calendar_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 3594 (class 2606 OID 729099)
-- Name: collaboration_inquiries collaboration_inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.collaboration_inquiries
    ADD CONSTRAINT collaboration_inquiries_pkey PRIMARY KEY (id);


--
-- TOC entry 3535 (class 2606 OID 24585)
-- Name: content_generations content_generations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_generations
    ADD CONSTRAINT content_generations_pkey PRIMARY KEY (id);


--
-- TOC entry 3617 (class 2606 OID 1105944)
-- Name: content_sessions content_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_sessions
    ADD CONSTRAINT content_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3637 (class 2606 OID 1941528)
-- Name: content_vault content_vault_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_vault
    ADD CONSTRAINT content_vault_pkey PRIMARY KEY (id);


--
-- TOC entry 3552 (class 2606 OID 630795)
-- Name: course_content course_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_content
    ADD CONSTRAINT course_content_pkey PRIMARY KEY (id);


--
-- TOC entry 3624 (class 2606 OID 1490955)
-- Name: course_notes course_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_notes
    ADD CONSTRAINT course_notes_pkey PRIMARY KEY (id);


--
-- TOC entry 3554 (class 2606 OID 630807)
-- Name: course_progress course_progress_pkey; Typepg_dump: creating CONSTRAINT "public.course_progress course_progress_user_id_product_id_module_id_lesson_id_key"
pg_dump: creating CONSTRAINT "public.course_purchases course_purchases_pkey"
pg_dump: creating CONSTRAINT "public.course_purchases course_purchases_user_id_product_id_key"
pg_dump: creating CONSTRAINT "public.drop_views drop_views_pkey"
pg_dump: creating CONSTRAINT "public.email_deliveries email_deliveries_pkey"
pg_dump: creating CONSTRAINT "public.feed_layout feed_layout_pkey"
pg_dump: creating CONSTRAINT "public.freebie_signups freebie_signups_email_key"
pg_dump: creating CONSTRAINT "public.freebie_signups freebie_signups_pkey"
pg_dump: creating CONSTRAINT "public.generated_workbooks generated_workbooks_pkey"
pg_dump: creating CONSTRAINT "public.ladder_progress ladder_progress_pkey"
pg_dump: creating CONSTRAINT "public.monthly_drops monthly_drops_pkey"
pg_dump: creating CONSTRAINT "public.monthly_drops monthly_drops_slug_key"
pg_dump: creating CONSTRAINT "public.pdf_logs pdf_logs_pkey"
pg_dump: creating CONSTRAINT "public.photo_library photo_library_pkey"
pg_dump: creating CONSTRAINT "public.planner_items planner_items_pkey"
pg_dump: creating CONSTRAINT "public.pose_sessions pose_sessions_pkey"
pg_dump: creating CONSTRAINT "public.purchases purchases_pkey"
: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3556 (class 2606 OID 630809)
-- Name: course_progress course_progress_user_id_product_id_module_id_lesson_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_progress
    ADD CONSTRAINT course_progress_user_id_product_id_module_id_lesson_id_key UNIQUE (user_id, product_id, module_id, lesson_id);


--
-- TOC entry 3558 (class 2606 OID 630821)
-- Name: course_purchases course_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_purchases
    ADD CONSTRAINT course_purchases_pkey PRIMARY KEY (id);


--
-- TOC entry 3560 (class 2606 OID 630823)
-- Name: course_purchases course_purchases_user_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.course_purchases
    ADD CONSTRAINT course_purchases_user_id_product_id_key UNIQUE (user_id, product_id);


--
-- TOC entry 3600 (class 2606 OID 753683)
-- Name: drop_views drop_views_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views
    ADD CONSTRAINT drop_views_pkey PRIMARY KEY (id);


--
-- TOC entry 3550 (class 2606 OID 622602)
-- Name: email_deliveries email_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_deliveries
    ADD CONSTRAINT email_deliveries_pkey PRIMARY KEY (id);


--
-- TOC entry 3588 (class 2606 OID 696341)
-- Name: feed_layout feed_layout_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.feed_layout
    ADD CONSTRAINT feed_layout_pkey PRIMARY KEY (id);


--
-- TOC entry 3568 (class 2606 OID 655373)
-- Name: freebie_signups freebie_signups_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freebie_signups
    ADD CONSTRAINT freebie_signups_email_key UNIQUE (email);


--
-- TOC entry 3570 (class 2606 OID 655371)
-- Name: freebie_signups freebie_signups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.freebie_signups
    ADD CONSTRAINT freebie_signups_pkey PRIMARY KEY (id);


--
-- TOC entry 3621 (class 2606 OID 1376265)
-- Name: generated_workbooks generated_workbooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.generated_workbooks
    ADD CONSTRAINT generated_workbooks_pkey PRIMARY KEY (id);


--
-- TOC entry 3590 (class 2606 OID 712729)
-- Name: ladder_progress ladder_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ladder_progress
    ADD CONSTRAINT ladder_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3580 (class 2606 OID 679946)
-- Name: monthly_drops monthly_drops_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_drops
    ADD CONSTRAINT monthly_drops_pkey PRIMARY KEY (id);


--
-- TOC entry 3582 (class 2606 OID 1712137)
-- Name: monthly_drops monthly_drops_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.monthly_drops
    ADD CONSTRAINT monthly_drops_slug_key UNIQUE (slug);


--
-- TOC entry 3604 (class 2606 OID 770058)
-- Name: pdf_logs pdf_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pdf_logs
    ADD CONSTRAINT pdf_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 3566 (class 2606 OID 647179)
-- Name: photo_library photo_library_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.photo_library
    ADD CONSTRAINT photo_library_pkey PRIMARY KEY (id);


--
-- TOC entry 3584 (class 2606 OID 688138)
-- Name: planner_items planner_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.planner_items
    ADD CONSTRAINT planner_items_pkey PRIMARY KEY (id);


--
-- TOC entry 3619 (class 2606 OID 1105955)
-- Name: pose_sessions pose_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pose_sessions
    ADD CONSTRAINT pose_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3598 (class 260pg_dump: creating CONSTRAINT "public.sandra_chats sandra_chats_pkey"
pg_dump: creating CONSTRAINT "public.sandra_prompts sandra_prompts_pkey"
pg_dump: creating CONSTRAINT "public.sandra_quotes sandra_quotes_pkey"
pg_dump: creating CONSTRAINT "public.user_sessions session_pkey"
pg_dump: creating CONSTRAINT "public.sessions sessions_pkey"
pg_dump: creating CONSTRAINT "public.starter_kit_certificates starter_kit_certificates_certificate_id_key"
pg_dump: creating CONSTRAINT "public.starter_kit_certificates starter_kit_certificates_pkey"
pg_dump: creating CONSTRAINT "public.starter_kit_progress starter_kit_progress_pkey"
pg_dump: creating CONSTRAINT "public.subscription_plans subscription_plans_pkey"
pg_dump: creating CONSTRAINT "public.template_customizations template_customizations_pkey"
pg_dump: creating CONSTRAINT "public.uploads uploads_pkey"
pg_dump: creating CONSTRAINT "public.user_aesthetic_selections user_aesthetic_selections_pkey"
pg_dump: creating CONSTRAINT "public.user_profiles user_profiles_pkey"
pg_dump: creating CONSTRAINT "public.user_profiles user_profiles_user_id_key"
pg_dump: creating CONSTRAINT "public.users users_email_unique"
pg_dump: creating CONSTRAINT "public.users users_pkey"
pg_dump: creating CONSTRAINT "public.vault_entries vault_entries_pkey"
6 OID 737302)
-- Name: purchases purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.purchases
    ADD CONSTRAINT purchases_pkey PRIMARY KEY (id);


--
-- TOC entry 3574 (class 2606 OID 671763)
-- Name: sandra_chats sandra_chats_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_chats
    ADD CONSTRAINT sandra_chats_pkey PRIMARY KEY (id);


--
-- TOC entry 3576 (class 2606 OID 671775)
-- Name: sandra_prompts sandra_prompts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_prompts
    ADD CONSTRAINT sandra_prompts_pkey PRIMARY KEY (id);


--
-- TOC entry 3578 (class 2606 OID 671786)
-- Name: sandra_quotes sandra_quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sandra_quotes
    ADD CONSTRAINT sandra_quotes_pkey PRIMARY KEY (id);


--
-- TOC entry 3546 (class 2606 OID 122886)
-- Name: user_sessions session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_sessions
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- TOC entry 3537 (class 2606 OID 24592)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (sid);


--
-- TOC entry 3610 (class 2606 OID 1097764)
-- Name: starter_kit_certificates starter_kit_certificates_certificate_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_certificates
    ADD CONSTRAINT starter_kit_certificates_certificate_id_key UNIQUE (certificate_id);


--
-- TOC entry 3612 (class 2606 OID 1097762)
-- Name: starter_kit_certificates starter_kit_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_certificates
    ADD CONSTRAINT starter_kit_certificates_pkey PRIMARY KEY (id);


--
-- TOC entry 3615 (class 2606 OID 1097777)
-- Name: starter_kit_progress starter_kit_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.starter_kit_progress
    ADD CONSTRAINT starter_kit_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3596 (class 2606 OID 737291)
-- Name: subscription_plans subscription_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscription_plans
    ADD CONSTRAINT subscription_plans_pkey PRIMARY KEY (id);


--
-- TOC entry 3602 (class 2606 OID 761864)
-- Name: template_customizations template_customizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.template_customizations
    ADD CONSTRAINT template_customizations_pkey PRIMARY KEY (id);


--
-- TOC entry 3586 (class 2606 OID 696330)
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 3608 (class 2606 OID 1097751)
-- Name: user_aesthetic_selections user_aesthetic_selections_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_aesthetic_selections
    ADD CONSTRAINT user_aesthetic_selections_pkey PRIMARY KEY (id);


--
-- TOC entry 3627 (class 2606 OID 1605643)
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 3629 (class 2606 OID 1605645)
-- Name: user_profiles user_profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_profiles
    ADD CONSTRAINT user_profiles_user_id_key UNIQUE (user_id);


--
-- TOC entry 3539 (class 2606 OID 24608)
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- TOC entry 3541 (class 2606 OID 24606)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3562 (class 2606 OID 638985)pg_dump: creating CONSTRAINT "public.vip_applications vip_applications_pkey"
pg_dump: creating CONSTRAINT "public.vip_progress vip_progress_pkey"
pg_dump: creating CONSTRAINT "public.visual_editor_sessions visual_editor_sessions_pkey"
pg_dump: creating CONSTRAINT "public.workbooks workbooks_pkey"
pg_dump: creating INDEX "public.IDX_session_expire"
pg_dump: creating INDEX "public.idx_generated_workbooks_user"
pg_dump: creating INDEX "public.idx_starter_kit_progress_user"
pg_dump: creating INDEX "public.idx_user_profiles_user_id"
pg_dump: creating TRIGGER "public.user_profiles update_user_profiles_updated_at"
pg_dump: creating FK CONSTRAINT "public.content_generations content_generations_user_id_users_id_fk"
pg_dump: creating FK CONSTRAINT "public.drop_views drop_views_drop_id_fkey"
pg_dump: creating FK CONSTRAINT "public.drop_views drop_views_user_id_fkey"

-- Name: vault_entries vault_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vault_entries
    ADD CONSTRAINT vault_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 3572 (class 2606 OID 663560)
-- Name: vip_applications vip_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vip_applications
    ADD CONSTRAINT vip_applications_pkey PRIMARY KEY (id);


--
-- TOC entry 3592 (class 2606 OID 712743)
-- Name: vip_progress vip_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vip_progress
    ADD CONSTRAINT vip_progress_pkey PRIMARY KEY (id);


--
-- TOC entry 3631 (class 2606 OID 1843210)
-- Name: visual_editor_sessions visual_editor_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visual_editor_sessions
    ADD CONSTRAINT visual_editor_sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3543 (class 2606 OID 81929)
-- Name: workbooks workbooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.workbooks
    ADD CONSTRAINT workbooks_pkey PRIMARY KEY (id);


--
-- TOC entry 3544 (class 1259 OID 122887)
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "IDX_session_expire" ON public.user_sessions USING btree (expire);


--
-- TOC entry 3622 (class 1259 OID 1376268)
-- Name: idx_generated_workbooks_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_generated_workbooks_user ON public.generated_workbooks USING btree (user_id);


--
-- TOC entry 3613 (class 1259 OID 1376266)
-- Name: idx_starter_kit_progress_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_starter_kit_progress_user ON public.starter_kit_progress USING btree (user_id);


--
-- TOC entry 3625 (class 1259 OID 1605646)
-- Name: idx_user_profiles_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_profiles_user_id ON public.user_profiles USING btree (user_id);


--
-- TOC entry 3641 (class 2620 OID 1605649)
-- Name: user_profiles update_user_profiles_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 3638 (class 2606 OID 24609)
-- Name: content_generations content_generations_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.content_generations
    ADD CONSTRAINT content_generations_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 3639 (class 2606 OID 753689)
-- Name: drop_views drop_views_drop_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views
    ADD CONSTRAINT drop_views_drop_id_fkey FOREIGN KEY (drop_id) REFERENCES public.monthly_drops(id);


--
-- TOC entry 3640 (class 2606 OID 753684)
-- Name: drop_views drop_views_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.drop_views
    ADD CONSTRAINT drop_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-06-12 17:06:24 UTC

--
-- PostgreSQL database dump complete
--

